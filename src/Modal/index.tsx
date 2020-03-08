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

function defaultMapState(state: ModalState, ownProps?: any) {
  return state;
}


export function createModal(mapState = defaultMapState) {
  return (Component: any) => ({ modal, ...other }: { modal: ModalState }) => {
    const props = mapState(modal, other);

    return (
      <Modal visible={modal.visible}>
        <Component {...other} {...props} />
      </Modal>
    )
  }
}
