import React from 'react';
import NiceModal from '@/components/modalManager/NiceModal';
import { isIOS } from '@/untils/Platform';
import { MyAlertProps } from '../dialog/MyAlert.types';

type ModalsType = { [id: string]: React.FC<any> };
interface DefaultOptions {
  strict?: boolean;
  props?: any;
  reactNativeModalCompatibleMode?: boolean;
}
const defaultOptions: DefaultOptions = {
  strict: false,
  props: null,
  reactNativeModalCompatibleMode: false,
};

const dummy = () => null;

class ModalManager {
  modals: ModalsType;
  currentModal: any;
  queuedModal: any;
  options: DefaultOptions;
  callbacksOnVisibleStateChange: any;

  constructor() {
    this.modals = {};
    this.currentModal = null;
    this.queuedModal = null;
    this.options = defaultOptions;
    this.callbacksOnVisibleStateChange = [];
  }

  setup(modals: ModalsType, options: DefaultOptions = {}) {
    this.modals = { ...modals };
    this.options = {
      ...this.options,
      ...options,
    };
  }

  cleanup() {
    this.modals = {};
  }

  getOption(key) {
    return this.options[key];
  }

  handleModalDismiss() {
    console.log('handleModalDismiss');
    if (this.queuedModal) {
      this.currentModal = this.queuedModal;
      this.queuedModal = null;
      this.callbacksOnVisibleStateChange.forEach((callback) => callback(true));
    } else {
      this.currentModal = null;
    }
  }

  getCurrentModal() {
    return (this.currentModal && this.currentModal.component) || dummy;
  }

  isShowingModal(): boolean {
    return !!(this.currentModal && this.currentModal.component);
  }

  getCurrentModalProps() {
    return {
      ...this.options.props,
      ...(this.currentModal && this.currentModal.props),
    };
  }

  register(modalName, modalComponent) {
    if (__DEV__ && this.modals[modalName]) {
      console.warn(
        `ModalManager: replacing previous modal with name "${modalName}". Give unique names for modals.`,
      );
    }

    this.modals[modalName] = modalComponent;
  }

  open(modalName: string, props: MyAlertProps) {
    console.log('open', modalName);
    if (isIOS()) {
      this.closeAll();
    }
    if (this.modals[modalName]) {
      NiceModal.show(this.modals[modalName], { ...props, name: modalName });
    } else if (__DEV__) {
      console.warn(
        `ModalManager: can't open modal with name "${modalName}" - not found.`,
      );
    }
  }

  hide(modalName = '') {
    if (this.modals[modalName]) {
      NiceModal.hide(this.modals[modalName]);
    }
  }

  close(modalName = '') {
    if (this.modals[modalName]) {
      NiceModal.remove(this.modals[modalName]);
    }
  }

  closeAll() {
    NiceModal.removeAll();
  }
}

const modalManager = new ModalManager();
export default modalManager;
