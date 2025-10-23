// MyAlert.tsx
import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { MyAlertProps } from './MyAlert.types';
import { useTranslation } from 'react-i18next';

interface Props extends MyAlertProps {
  visible: boolean;
  onClose: () => void;
}

const MyAlert: React.FC<Props> = ({
  visible,
  onClose,
  title,
  message,
  buttons = [],
}) => {
  const { t } = useTranslation();

  const renderButtons = () => {
    if (buttons.length === 0) {
      return (
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>{t('btn_app_ok')}</Text>
        </TouchableOpacity>
      );
    }

    return buttons.map((btn, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.button,
          btn.style === 'cancel' && styles.cancelButton,
          btn.style === 'destructive' && styles.destructiveButton,
        ]}
        onPress={() => {
          onClose();
          btn.onPress?.();
        }}
      >
        <Text
          style={[
            styles.buttonText,
            btn.style === 'cancel' && styles.cancelText,
            btn.style === 'destructive' && styles.destructiveText,
          ]}
        >
          {btn.text}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {title && <Text style={styles.title}>{title}</Text>}
              <Text style={styles.message}>{message}</Text>
              <View style={styles.buttonRow}>{renderButtons()}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  cancelText: {
    color: '#333',
  },
  destructiveButton: {
    backgroundColor: '#e74c3c',
  },
  destructiveText: {
    color: '#fff',
  },
});
export default MyAlert;
