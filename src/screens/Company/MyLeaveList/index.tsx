import Header from '@/components/header';
import { useMyLeaveList } from '@/hooks/Company/MyLeaveList';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';

const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return 'Chờ duyệt';
    case 1:
      return 'Đã duyệt';
    case 2:
      return 'Từ chối';
    case 3:
      return 'Quá hạn';
    default:
      return 'Không xác định';
  }
};

const getStatusColor = (status: number) => {
  switch (status) {
    case 0: // chờ duyệt
      return '#FF9800'; // cam nổi
    case 1: // đã duyệt
      return '#00C853'; // xanh lá neon
    case 2: // từ chối
      return '#D50000'; // đỏ tươi
    case 3: // quá hạn
      return '#AA00FF'; // tím đậm nổi bật
    default:
      return '#000'; // fallback
  }
};

const MyLeaveList = () => {
  const navigation = useNavigation<any>();
  const { data, loading, setPage, hasMore, deleteRequest, categorys } =
    useMyLeaveList();
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});
  const handleDelete = (ID: string) => {
    swipeableRefs.current[ID]?.close();
  };
  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => {
          handleDelete(id);
          deleteRequest(id);
        }}
      >
        <Icon name="trash-2" size={20} color="#fff" />
        <Text style={styles.deleteText}>Xóa</Text>
      </TouchableOpacity>
    );
  };
  const renderItem = ({ item }: { item: (typeof data)[0] }) => {
    const typeName = categorys?.find(
      (elm) => elm.key === item.CategoryID,
    )?.label;
    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item.ID)}
        ref={(ref) => (swipeableRefs.current[item.ID] = ref)}
      >
        <View style={styles.itemContainer}>
          <View style={styles.wrapContent}>
            <Text style={styles.label}>
              Ngày tạo:{' '}
              <Text style={styles.value}>
                {moment(item.DateRequest).format('DD/MM/YYYY')}
              </Text>
            </Text>
            {item.Time && (
              <Text style={styles.label}>
                Thời gian nghỉ: <Text style={styles.value}>{item.Time}</Text>
              </Text>
            )}
            <Text style={styles.label}>
              Lý do: <Text style={styles.value}>{item.Reason}</Text>
            </Text>
            <Text style={styles.label}>
              Loại đơn: <Text style={styles.value}>{typeName}</Text>
            </Text>
            <Text style={styles.label}>
              Trạng thái:{' '}
              <Text
                style={[styles.label, { color: getStatusColor(item.Status) }]}
              >
                {getStatusText(item.Status)}
              </Text>
            </Text>
          </View>
          <Image source={require('../../../assets/images/leave.png')} />
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Đơn nghỉ phép của tôi"
        rightButton={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CreateHoliday');
            }}
          >
            <Ionicons name="add-circle-outline" size={30} color={'#fff'} />
          </TouchableOpacity>
        }
        onGoBack={() => {
          navigation.goBack();
        }}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        onEndReached={() => {
          if (!loading && hasMore) {
            setPage((prev) => prev + 1);
          }
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator size="small" color="#007bff" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    padding: 14,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#555',
  },
  wrapContent: {
    gap: 3,
  },
  deleteBtn: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});

export default MyLeaveList;
