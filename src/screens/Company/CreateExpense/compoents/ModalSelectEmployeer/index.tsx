import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSelector } from 'react-redux';
import { BASE_URL } from '@env';
import Icon from 'react-native-vector-icons/Feather';

const ModalSelectEmployeer = forwardRef((props: any, ref) => {
  const [open, setOpen] = useState(false);
  const common = useSelector((state: any) => state.common);
  const user = useSelector((state: any) => state.user);
  const [selectedFollower, setSelectedFollower] = useState<any>(null);
  const handleSelectFollower = (employeer: any) => {
    props.onChange(employeer);
  };
  useEffect(() => {
    setSelectedFollower(props?.selectedFollower || []);
  }, [props?.selectedFollower]);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      setOpen(true);
    },
    closeModal: () => setOpen(false),
  }));

  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent
      statusBarTranslucent={true}
      onRequestClose={() => setOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => setOpen(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Chọn người theo dõi</Text>
              <FlatList
                data={
                  common?.employeers.filter((elm: any) => elm.ID !== user.Id) ||
                  []
                }
                keyExtractor={(item) => item.ID.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.followerItem,
                      !!selectedFollower?.find(
                        (elm: any) => elm === item.ID,
                      ) && {
                        backgroundColor: '#DBEAFE',
                      },
                    ]}
                    onPress={() => handleSelectFollower(item)}
                  >
                    {item.Avata ? (
                      <Image
                        source={{ uri: `${BASE_URL}${item.Avata}` }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View style={styles.notAvatar}>
                        <Icon name="user" size={24} color="#3B82F6" />
                      </View>
                    )}
                    <View>
                      <Text style={styles.followerName}>{item.Name}</Text>
                      <Text style={styles.followerDept}>
                        {
                          common.deparments.find(
                            (d: any) => d.ID === item.DepartmentId,
                          )?.Name
                        }
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                style={{ height: 200 }}
              />
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setOpen(false)}
              >
                <Text style={styles.modalCloseText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  followerItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
  },
  followerName: {
    fontSize: 15,
    color: '#111827',
  },
  followerDept: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 5,
  },
  modalClose: {
    backgroundColor: '#2563EB',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: '600',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 30,
    marginRight: 16,
  },
  notAvatar: {
    width: 45,
    height: 45,
    borderRadius: 60,
    marginRight: 16,
    backgroundColor: '#ccc', // xám nhạt
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ModalSelectEmployeer;
