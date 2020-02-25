import { useContext, useEffect, useRef } from 'react';
import TransitionContext from './TransitionContext';
import shallowEqual from './shallowEqual';

const defaultMap = next => next;

export default function useTransition(animation, driver, mapState = defaultMap) {
  const controller = useContext(TransitionContext);
  const ref = useRef({});

  useEffect(() => {
    ref.current.animation = animation;

    function callback(nextState, currentState) {
      const next = mapState(nextState, currentState);
      if (next === null) return;
      if (shallowEqual(next, ref.current.value)) return;
      ref.current.value = next;
      const anim = ref.current.animation(driver, next);
      if (anim) {
        const cnt = controller.onSetup();
        if (process.env.NODE_ENV === 'development') {
          // console.log(`[Controller/${controller.id}] transition.useEffect (${cnt}) start`, next);
        }
        anim.start(() => {
          const cntDecr = controller.onComplete();
          if (process.env.NODE_ENV === 'development') {
            // console.log(`[Controller/${controller.id}] transition.useEffect (${cntDecr}) complete`, next);
          }
        });
      }
    }

    // Check if the animation needs to run on mount
    callback(controller.getState(), controller.getPrevState());

    return controller.registerTransition(callback);
  }, [mapState]);

  return controller.dispatch;
}
