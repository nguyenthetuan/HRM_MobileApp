import Header from '@/components/header';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Swipeable } from 'react-native-gesture-handler';
import { useNotification } from '@/hooks/Notification';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Notification = () => {
  const { data, setData, updateNotification, deleteNotification } =
    useNotification();
  console.log('data', data);
  const navigation = useNavigation<any>();
  const user = useSelector((state: any) => state.user);
  console.log('user', user);

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});
  const handleDelete = (ID: string) => {
    setData((prev) => prev.filter((item) => item.ID !== ID));
    swipeableRefs.current[ID]?.close();
  };
  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => {
          deleteNotification(id);
          handleDelete(id);
        }}
      >
        <Icon name="trash-2" size={20} color="#fff" />
        <Text style={styles.deleteText}>Xóa</Text>
      </TouchableOpacity>
    );
  };

  const navigateTo = (item: any) => {
    updateNotification(item.ID);
    if (user.PositionId === 2 || user.Id === item.UserIdRq) {
      return;
    }
    if (item.Type === 'ExRequest') {
      navigation.navigate('ExpenseList');
    } else {
      navigation.navigate('LeaveList', {});
    }
  };

  const renderItem = ({ item }) => {
    const isUnread = item.Status === 0; // chưa đọc
    const typeLabel =
      item.Type === 'ExRequest'
        ? 'Kinh phí'
        : item.Type === 'Request'
          ? 'Xin phép'
          : 'Khác';

    const typeColor =
      item.Type === 'ExRequest'
        ? '#28a745' // xanh lá
        : item.Type === 'Request'
          ? '#ff9500' // cam
          : '#007AFF'; // xanh dương mặc định

    return (
      <Swipeable
        ref={(ref) => (swipeableRefs.current[item.ID] = ref)}
        renderRightActions={() => renderRightActions(item.ID)}
      >
        <TouchableOpacity
          style={[styles.item, isUnread && { backgroundColor: '#E6F0FF' }]}
          onPress={() => {
            navigateTo(item);
          }}
        >
          <View
            style={[
              styles.iconWrap,
              item.Type === 'ExRequest'
                ? { backgroundColor: '#28a745' }
                : item.Type === 'Request'
                  ? { backgroundColor: '#ff9500' }
                  : { backgroundColor: '#007AFF' },
            ]}
          >
            <Icon
              name={
                item.Type === 'ExRequest'
                  ? 'dollar-sign'
                  : item.Type === 'Request'
                    ? 'file-text'
                    : 'bell'
              }
              size={20}
              color="#fff"
            />
          </View>

          <View style={styles.textWrap}>
            <Text style={styles.title}>{item.Title}</Text>
            <Text style={styles.type}>{item.NotificationMessage}</Text>
          </View>

          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        <View style={[styles.badge, { backgroundColor: typeColor }]}>
          <Text style={styles.badgeText}>{typeLabel}</Text>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Thông báo" />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    width: '80%',
  },
  type: {
    fontSize: 13,
    color: '#666',
    marginTop: 5,
    width: '50%',
  },
  separator: {
    height: 1,
    backgroundColor: '#fff',
  },
  deleteBtn: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    position: 'absolute',
    top: 12,
    right: 40, // để chừa khoảng trống trước icon chevron-right
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});
