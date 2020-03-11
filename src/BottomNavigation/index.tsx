import React from 'react';
import { View, StyleSheet } from 'react-native';
import RootView from '../RootView';

import { textColor } from './theme';
import Nav from './Nav';

type Props = {
  children: Array<React.ReactNode>,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: textColor,
  },
});

/**
 * Display a navigation bar at the bottom of the screen, with each navigation
 * item navigating to its repective screen when pressed.
 *
 * Uses the available view area, and places the navigation bar at the bottom
 * of the view with the remaining area for the Screen to be displayed.
 *
 * On iOS, it puts an extra `12px` bottom margin for the ios **Home Bar**. And
 * since the Screen area is wrapped around KeyboardAvoidingView, the extra
 * margin is balanced when the soft keyboard is showing.
 *
 */
function BottomNavigation(props: Props) {
  return (
    <RootView>
      <View style={styles.container} {...props} />
    </RootView>
  );
}

BottomNavigation.Body = (props: Props) => {
  return <View style={styles.container} {...props} />
}

BottomNavigation.Footer = (props: Props) => {
  return <View style={styles.navBar} {...props} />
}

BottomNavigation.Item = Nav;

export default BottomNavigation;
