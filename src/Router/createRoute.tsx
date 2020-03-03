import React from 'react';
import { useTransitionState } from './transition';

export default function createRoute(name) {
  function getRouteParams(nextState, currentState) {
    if (nextState.route === name) return nextState.params || {};
    if (currentState.route === name) return currentState.params || {};
    return false;
  }

  return (Component) => {
    // Memoize the Component to avoid re-rendering
    const MemoComponent = React.memo(Component);
    return (props) => {
      const params = useTransitionState(getRouteParams);
      if (params === false) return null;
      return (
        <MemoComponent {...params} {...props} />
      );
    };
  };
}
