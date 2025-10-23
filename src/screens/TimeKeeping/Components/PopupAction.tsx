import { useNavigation } from '@react-navigation/native';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const PopupAction = (props, ref) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<any>();

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false),
  }));

  const closeModal = () => setVisible(false);

  const navToCreateHoloday = (item: any) => {
    setVisible(false);
    navigation.navigate('CreateHoliday', { date: props.dates, type: item.key });
  };

  function isBeforeToday(dateString: string) {
    if (!dateString) return false;
    const inputDate: any = new Date(dateString);
    if (isNaN(inputDate)) {
      throw new Error('Ngày không hợp lệ: ' + dateString);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate < today;
  }

  const categorys = useMemo(() => {
    const arrayCategory = [
      {
        key: 1,
        label: 'Xin đi muộn',
      },
      {
        key: 4,
        label: 'Xin về sớm',
      },
      {
        key: 2,
        label: 'Xin nghỉ phép',
      },
      {
        key: 3,
        label: 'Giải trình',
      },
    ];
    return isBeforeToday(props.dates)
      ? arrayCategory.filter((elm) => elm.key === 3)
      : arrayCategory;
  }, [props.dates]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.popupContainer}>
              <FlatList
                data={categorys}
                style={{ height: 200 }}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => navToCreateHoloday(item)}
                    >
                      <Text style={styles.buttonText}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default forwardRef(PopupAction);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  popupContainer: {
    backgroundColor: '#fff',
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  button: {
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
});
