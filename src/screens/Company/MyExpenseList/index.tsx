import Header from '@/components/header';
import { useMyExpenseList } from '@/hooks/Company/MyExpenseList';
import { formatMoney } from '@/untils/format/formatMoney';
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
import { expenseType } from '@/untils/data';

const getStatusText = (status: number, amount: number) => {
  switch (status) {
    case 0:
      return 'Chờ quản lý duyệt';
    case 1:
      return 'Chờ kế toán duyệt';
    case 2:
      return 'Chờ giám đốc duyệt';
    case 3:
      return 'Kế toán đã chuyển tiền';
    case 4:
      return 'Từ chối';
    default:
      return 'Không xác định';
  }
};

const getStatusColor = (status: number) => {
  switch (status) {
    case 0: // Chờ duyệt
      return '#FFC107'; // vàng
    case 1: // Quản lý duyệt
    case 2: // Giám đốc duyệt
      return '#2196F3'; // xanh dương
    case 3: // Kế toán quyết toán
      return '#9C27B0'; // tím
    case 4: // Từ chối duyệt
      return '#F44336'; // đỏ
    default:
      return '#9E9E9E'; // xám mặc định
  }
};

const MyExpenseList = () => {
  const navigation = useNavigation<any>();
  const { data, loading, setPage, hasMore, deleteRequestEx } =
    useMyExpenseList();
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});
  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => {
          deleteRequestEx(id);
          swipeableRefs.current[id]?.close();
        }}
      >
        <Icon name="trash-2" size={20} color="#fff" />
        <Text style={styles.deleteText}>Xóa</Text>
      </TouchableOpacity>
    );
  };
  const renderItem = ({ item }: { item: (typeof data)[0] }) => {
    const nameType = expenseType.find(
      (elm) => `${elm.key}` === `${item.ExpenseType}`,
    )?.label;
    return (
      <Swipeable
        ref={(ref) => (swipeableRefs.current[item.Id] = ref)}
        renderRightActions={() => renderRightActions(item.Id)}
      >
        <View style={styles.itemContainer}>
          <View style={styles.wrapContent}>
            <Text style={styles.label}>
              Ngày tạo:{' '}
              <Text style={styles.value}>
                {moment(item.DateRequest).format('DD/MM/YYYY')}
              </Text>
            </Text>
            <Text style={styles.label}>
              Số tiền:{' '}
              <Text style={styles.value}>{formatMoney(item.Amount)}(Vnđ)</Text>
            </Text>
            <Text style={styles.label} numberOfLines={2}>
              Lý do: <Text style={styles.value}>{item.Reason}</Text>
            </Text>
            <Text style={styles.label}>
              Loại: <Text style={styles.value}>{nameType}</Text>
            </Text>
            <Text style={styles.label}>
              Trạng thái:{' '}
              <Text
                style={[styles.label, { color: getStatusColor(item.Status) }]}
              >
                {getStatusText(item.Status, item.Amount)}
              </Text>
            </Text>
          </View>
          <Image source={require('../../../assets/images/my_expense.png')} />
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Đơn xin duyệt kinh phí của tôi"
        rightButton={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CreateExpense');
            }}
          >
            <Ionicons
              name="add-circle-outline"
              size={30}
              color={'#fff'}
              style={styles.wrapIconAdd}
            />
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
  wrapIconAdd: {
    zIndex: 1,
  },
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
    width: '80%',
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

export default MyExpenseList;
