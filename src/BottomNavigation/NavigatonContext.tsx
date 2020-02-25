// @flow
import React from 'react';
import { ComponentType } from 'react';

export type Context = {
  Screen: ComponentType,
  setScreen: any,
};

// $FlowFixMe Default value is not required
const NavigationContext = React.createContext<Context>(null);

export default NavigationContext;
