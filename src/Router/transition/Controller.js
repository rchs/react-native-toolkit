// @flow

/* eslint-disable no-underscore-dangle */

let gid = 0;

export default class Controller<T> {
  constructor(initialState: T, reducer: (state: T, action: any) => T, prevState = initialState) {
    gid += 1;
    this.id = gid;

    this.state = initialState;
    this.prevState = prevState;

    this.reducer = reducer;
    this.queue = [];

    this.stateListeners = [];
    this.transitions = [];
    this.running = 0;

    this.onComplete = this.onComplete.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.getState = this.getState.bind(this);
  }

  registerListener(listener) {
    this.stateListeners.push(listener);

    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== listener);
    };
  }

  registerTransition(transition) {
    this.transitions.push(transition);

    return () => {
      this.transitions = this.transitions.filter(t => t !== transition);
    };
  }

  onSetup() {
    this.running += 1;
    return this.running;
  }

  onComplete() {
    this.running -= 1;
    if (this.running === 0) {
      this.completeTransition();
    }

    return this.running;
  }

  completeTransition() {
    if (this.prevState !== this.state) {
      this.prevState = this.state;
      // No more transitions remaining, settle down to a stable state
      // which will basically hide the components that are not required any more
      this.stateListeners.forEach((listener) => {
        listener(this.state, this.state);
      });
    }

    // If there are more actions continue with that
    if (this.running === 0 && this.queue.length > 0) {
      // If the queue is too long, then dispatch all actions
      // TODO: There should be some way to detect if we want to do a batch operation
      const action = this.queue.shift();
      this.internalDispatch(action);
    }
  }

  dispatch(action) {
    // Could either be an array of actions or action
    if (this.isRunning()) {
      if (process.env.NODE_ENV === 'development' || __DEV__) {
        // console.log(`[Controller/${this.id}] Queuing action ${action}`);
      }
      this.queue.push(action);
      return;
    }

    if (process.env.NODE_ENV === 'development' || __DEV__) {
      // console.log(`[Controller/${this.id}] Running action ${action}`, action);
    }

    this.internalDispatch(action);
  }

  internalDispatch(action) {
    // Reduce the action or actions
    const nextState = Array.isArray(action)
      ? action.reduce(
        (res, act) => {
          this.state = res;
          const next = this.reducer(res, act);
          return next;
        }, this.state
      ) : this.reducer(this.state, action);

    // Highly unlikely, an action should change the state
    if (nextState === this.state) {
      return;
    }

    // Run all the updates
    this.prevState = this.state;
    this.state = nextState;
    this.stateListeners.forEach((listener) => {
      listener(this.state, this.prevState);
    });

    // Run all the existing transitions
    this.transitions.forEach((transition) => {
      transition(this.state, this.prevState);
    });

    if (this.running === 0) this.completeTransition();
  }

  getState() {
    return this.state;
  }

  getPrevState() {
    return this.prevState;
  }

  isRunning() {
    return this.running > 0;
  }

  isComplete() {
    return this.running === 0;
  }
}
