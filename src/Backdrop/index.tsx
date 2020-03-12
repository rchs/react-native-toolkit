import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';

type Props = { onPress?: () => void, style?: ViewStyle };

export function Backdrop({ onPress, style }: Props) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[StyleSheet.absoluteFill, style]} />
    </TouchableWithoutFeedback>
  );
}
