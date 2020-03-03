import { useContext } from 'react';
import RouterContext from './RouterContext';

export function useRouter() {
  return useContext(RouterContext);
}

export function useRouteTo(path) {
  const setRoute = useContext(RouterContext);
  return () => setRoute(path);
}

export function useCurrentRoute() {
  const setRoute = useRouter();
  const currentRoute = {};
  setRoute((route, params) => {
    currentRoute.route = route;
    currentRoute.params = params;
  });
  return currentRoute;
}
