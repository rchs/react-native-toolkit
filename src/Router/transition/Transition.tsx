import React, { useRef } from 'react';
import TransitionContext from './TransitionContext';
import Controller from './Controller';

type Props<T> = {
  initialState?: T,
  reducer?: (state: T, action: any) => T,
};

function Transition<T>({ initialState, reducer, ...other }: Props<T>) {
  const ref = useRef(null);

  if (!ref.current) {
    ref.current = new Controller(initialState, reducer);
  }

  return (
    <TransitionContext.Provider value={ref.current} {...other} />
  );
}

Transition.defaultProps = {
  initialState: null,
  reducer: (state, action) => action,
};

export function withTransition(initialState, reducer) {
  return Component => props => (
    <Transition initialState={initialState} reducer={reducer}>
      <Component {...props} />
    </Transition>
  );
}

export default Transition;
