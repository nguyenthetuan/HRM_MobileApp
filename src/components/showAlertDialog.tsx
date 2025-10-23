import i18n from 'i18next';
import modalManager from '@/components/modalManager/ModalManager';
import { ModalName } from '@/constant/ModalConstant';
import { MyAlertProps } from '@/components/dialog/MyAlert.types';
import { goBack } from '@/untils/NavigatiorService';

export const showAlertDialog = (props: MyAlertProps) => {
  modalManager.open(ModalName.ALERT, {
    ...props,
  });
};

export const showMyAlert = (props: MyAlertProps) => {
  modalManager.open(ModalName.ALERT, props);
};

export const showDevelopingAlert = (businessId?: string) => {
  showAlertDialog({
    businessId,
    message: i18n.t('msg_app_feature_developing'),
    buttons: [
      {
        text: i18n.t('btn_app_ok'),
      },
    ],
  });
};

export const showDiscardAllChanges = (onPress: () => void) => {
  showAlertDialog({
    message: i18n.t('msg_app_discard_all_changes'),
    buttons: [
      {
        text: i18n.t('btn_cancel_booking_confirm_cancel'),
        style: 'cancel',
      },
      {
        text: i18n.t('btn_app_ok'),
        onPress: onPress,
      },
    ],
  });
};

export const showAlertDiscardAnyChanges = (onPress?: () => void) => {
  showAlertDialog({
    message: i18n.t('msg_app_discard_any_changes'),
    buttons: [
      {
        text: i18n.t('btn_alert_dialog_cancel'),
        style: 'cancel',
      },
      {
        text: i18n.t('btn_alert_dialog_ok'),
        onPress: () => {
          if (onPress) {
            onPress();
            return;
          }
          goBack();
        },
      },
    ],
    title: i18n.t('title_app_discard_any_changes'),
  });
};
