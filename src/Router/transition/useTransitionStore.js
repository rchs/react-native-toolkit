import { useContext } from 'react';
import TransitionContext from './TransitionContext';

export default function useTransitionStore() {
  const controller = useContext(TransitionContext);
  return controller.dispatch;
}

export function useTransitionController() {
  return useContext(TransitionContext);
}
