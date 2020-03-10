import React, { useState, useCallback } from 'react';
import { Modal } from 'react-native';

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
type MapState<P extends object, R extends object> = (state: ModalState, ownProps: P) => R;

const defaultMapState = <T extends object>(state: ModalState, ownProps: T) => {
  return { hide: state.hide };
}

export function createModal<P extends object, R extends object>(
  mapState: MapState<P, R> = defaultMapState
): (Component: React.ComponentType<P & R>) => React.FC<ModalProps<P>> {
  return (Component) => ({ modal, ...other }) => {
    const props = mapState(modal, other);

    return (
      <Modal visible={modal.visible}>
        <Component {...other} {...props} />
      </Modal>
    )
  }
}
