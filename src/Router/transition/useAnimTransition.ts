import { useContext, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import TransitionContext from './TransitionContext';

type ValueType<T> = T | { [name: string]: ValueType<T> };

type Animator<T> = () => Promise<void>;

export default function useAnimTransition<T extends ValueType<Animated.Value>, S>(
  selectAnimation: (nextState: S, currentState: null | S) => null | Animator<T>
) {
  const controller = useContext(TransitionContext);
  const recentAnim = useRef<Animator<T>>();

  useEffect(() => {
    async function callback(nextState: S, currentState: null | S) {
      const anim = selectAnimation(nextState, currentState);
      if (anim === null) return;

      // If its the same anim as the last one, no need to run
      if (recentAnim.current === anim) return;
      recentAnim.current = anim;

      controller.onSetup();
      // Run the animation until completion
      await anim();
      controller.onComplete();
    }

    // Run animation on mount
    callback(controller.getState(), controller.getPrevState());
    return controller.registerTransition(callback);
  }, [selectAnimation]);

  return controller.dispatch;
}
