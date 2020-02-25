import { useContext, useState, useEffect, useRef } from 'react';
import TransitionContext from './TransitionContext';

export default function useTransitionState(mapState, getInitialState) {
  const controller = useContext(TransitionContext);
  const [result, setResult] = useState(() => getInitialState ? getInitialState(controller.getState()) : mapState(
    controller.getState(),
    controller.getPrevState()
  ));

  const ref = useRef();

  useEffect(() => {
    function callback(nextState, prevState) {
      const v = mapState(nextState, prevState);
      if (process.env.NODE_ENV !== 'production') {
        if (v === undefined) {
          console.warn('You forgot to return a state from mapState callback in `useTransitionState`. You can return null if the local state hasn\'t changed.');
        }
      }

      if (v === null || v === undefined) return;

      // Avoiding shallow equal check here, since that would have been done by the mapState callback
      if (ref.current.value !== v) {
        ref.current.value = v;
        const cnt = controller.onSetup();
        if (process.env.NODE_ENV === 'development') {
          // console.log(`[Controller/${controller.id}] transitionState.useEffect (${cnt}) setup`, mapState.name, v, prevState);
        }
        setResult(v);
      }
    }

    // Also increase on first mount
    if (ref.current === undefined) {
      ref.current = {
        value: result,
      };
      const cnt = controller.onSetup();
      if (process.env.NODE_ENV === 'development') {
        // console.log(`[Controller/${controller.id}] transitionState.useEffect (${cnt}) setup first`, mapState.name, result);
      }
    } else {
      // Run a callback once since mapState has changed
      callback(controller.getState(), controller.getPrevState());
    }

    return controller.registerListener(callback);
    // This useEffect hook initializes the ref value with the initial result
    // hence it is intentionally not dependent on result and IT SHOULD NOT BE
  }, [mapState]);

  useEffect(() => {
    const cnt = controller.onComplete();
    if (process.env.NODE_ENV === 'development') {
      // console.log(`[Controller/${controller.id}] transitionState.useEffect (${cnt}) complete`, mapState.name, result);
    }
  }, [result]);

  return result;
}
