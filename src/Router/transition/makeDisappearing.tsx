import React, { ComponentClass } from 'react';
import useTransitionState from "./useTransitionState"

type MapState<S> = (next: S, prev: S) => boolean;

export function makeDisappearing<P = {}, S={}>(visibilityCheck: MapState<S>) {
  return (Component: React.FC<P> | ComponentClass<P>) => {
    return (props: P) => {
      const visible = useTransitionState(visibilityCheck);
      if (!visible) return null;
      return React.createElement(Component, props);
    }
  }
}
