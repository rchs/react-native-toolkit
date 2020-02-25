import React from 'react';
import Controller from './Controller';

const defaultController = new Controller(null);

const TransitionContext = React.createContext(defaultController);

export default TransitionContext;
