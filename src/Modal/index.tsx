import React, { useState, useCallback } from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View, ModalProps as RNModalProps, ViewStyle } from 'react-native';

type ModalState = {
  show: () => void,
  hide: () => void,
  visible: boolean,
}

export function useModalVisibility() {
  const [visible, setVisible] = useState<boolean>(false);

  const show: () => void = useCallback(() => setVisible(true), []);
  const hide: () => void = useCallback(() => setVisible(false), []);

  return {
    visible,
    show,
    hide,
  }
}

type ModalProps<P> = P & { modal: ModalState };
type MapState<P extends object> = (state: ModalState, ownProps: P) => {};

const defaultMapState = <P extends object>(state: ModalState, ownProps: P) => {
  return { hide: state.hide };
}

export function createModal<P extends object, R extends object>(
  mapState: MapState<P> = defaultMapState, options?: RNModalProps
): (Component: React.ComponentType<P & R>) => React.FC<ModalProps<P>> {
  return (Component) => ({ modal, ...other }) => {
    const props = mapState(modal, other);

    return (
      <Modal visible={modal.visible} {...options}>
        <Component {...other} {...props} />
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  }
});

type ModalBackDropProps = { onPress?: () => void, style?: ViewStyle };

export function ModalBackDrop({ onPress, style }: ModalBackDropProps) {
  return (
    <TouchableWithoutFeedback onPress={onPress && onPress}>
      <View style={[styles.container, style]} />
    </TouchableWithoutFeedback>
  );
}
