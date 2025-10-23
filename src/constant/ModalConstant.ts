import MyAlert from '@/components/dialog/MyAlert';
import { withNiceModal } from '@/components/modalManager/NiceModal';

export const ModalName = {
  ALERT: 'ALERT',
};

export const modalList = {
  [ModalName.ALERT]: MyAlert,
};

export const modals = Object.fromEntries(
  Object.keys(modalList).map((key) => [key, withNiceModal(modalList[key])]),
);
