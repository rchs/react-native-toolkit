import React, { useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import { useTransitionStore, withTransition, useTransitionController } from './transition';
import RouterContext from './RouterContext';

type Props = {
  onProcess: (url: string, setRoute: (route: string) => void) => void,
  initialRoute: string,
  onRouteChange: ({ route: string, params: {object} }) => void
}

function Router({ onRouteChange, onProcess, initialRoute, ...other }: Props) {
  const store = useTransitionController();

  const setRoute = useCallback((route, params) => {
    let to;
    if (typeof route === 'function') {
      const currentState = store.getState();
      const nextRoute = route(currentState.route, currentState.params);

      // nextRoute can be expected to be undefined to match our use case in useCurrentRoute
      if (nextRoute) {
        if (Array.isArray(nextRoute)) {
          to = { route: nextRoute[0], params: nextRoute[1] }
        } else {
          to = { route: nextRoute };
        }
      }
    } else {
      to = { route, params };
    }
    if (to) {
      store.dispatch(to);
      onRouteChange && onRouteChange(to);
    }
  }, []);

  useEffect(() => {
    async function handleUrl(event) {
      console.log('Open URL', event.url);
      return onProcess(event.url, setRoute);
    }

    Linking.getInitialURL().then((url) => {
      console.log('Got initial Url', url);
      if (url) {
        console.log('Initial url to handle', url);
        return onProcess(url, setRoute);
      } else {
        setRoute(initialRoute);
      }
    }).catch(err => {
      console.warn('Initial url error', err);
      setRoute(initialRoute);
    });

    Linking.addEventListener('url', handleUrl);
    return () => {
      Linking.removeEventListener('url', handleUrl);
    }
  }, []);

  return (
    <RouterContext.Provider value={setRoute} {...other} />
  );
}

export default withTransition({})(Router);
