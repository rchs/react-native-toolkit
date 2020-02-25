import React from 'react';
import { Animated } from 'react-native';

import useTransition from './useTransition';

type BoolFn = () => boolean;
type VoidFn = () => void;
type CallBackType = (args: { start: boolean, finished: boolean, open: boolean }) => void;
type Animation = (driver: Animated.Value, toValue: number) => Animated.CompositeAnimation;
type Options = { callback: CallBackType, initialValue: boolean };
type Toggler = { isOpen: BoolFn; isClose: BoolFn; open: VoidFn; close: VoidFn; toggle: VoidFn };

const createAnimationWithOptions = (
  animation: Animation,
  callback: CallBackType,
  openRef: React.MutableRefObject<boolean>
) => (driver: Animated.Value, toValue: number) => ({
  start: (endCallback?: (result: any) => void) => {
    openRef.current = Boolean(toValue);
    callback({ start: true, finished: false, open: openRef.current });
    animation(driver, toValue).start((res) => {
      endCallback && endCallback(res);
      callback({ start: false, finished: res.finished, open: openRef.current });
    });
  },
});


export default function useTransitionToggle<T>(
  animation: Animation,
  driver: Animated.Value,
  mapState: (state: T) => number,
  options?: Options,
): Toggler {
  const { initialValue = false, callback = () => { } } = options || {};
  const open = React.useRef<boolean>(initialValue);
  const anim = React.useMemo(() => createAnimationWithOptions(animation, callback, open), [callback]);
  
  useTransition(anim, driver, mapState);

  return React.useMemo(() => ({
    isOpen: () => open.current,
    isClose: () => !open.current,
    open: () => anim(driver, 1).start(),
    close: () => anim(driver, 0).start(),
    toggle: () => anim(driver, Number(!open.current)).start(),
  }), []);
}
