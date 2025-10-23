import Header from '@/components/header';
import { useExpenseList } from '@/hooks/Company/ExpenseList';
import { formatMoney } from '@/untils/format/formatMoney';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from '@env';
import { expenseType } from '@/untils/data';

// position:{
//   1: Trưởng phòng,
//   2: Nhân viên,
//   3: Kế toán,
//   4: Giám đốc
// }

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
    case 0: // Chờ quản lý duyệt
      return '#FFC107'; // vàng
    case 1: // Chờ kế toán duyệt
    case 2: // Chờ giám đốc duyệt
      return '#2196F3'; // xanh dương
    case 3: // Kế toán đã chuyển tiền
      return '#9C27B0'; // tím
    case 4: // Từ chối duyệt
      return '#F44336'; // đỏ
    default:
      return '#9E9E9E'; // xám mặc định
  }
};
const getNextStatus = (item: { Amount: number; Status: number }) => {
  if (item.Amount >= 10000000) {
    switch (item.Status) {
      case 0:
        return 2;
      case 2:
        return 1;
      case 1:
        return 3;
      default:
        return 0;
    }
  } else {
    switch (item.Status) {
      case 0:
        return 1;
      case 1:
        return 3;
      default:
        return 0;
    }
  }
};

const ExpenseList = () => {
  const navigation = useNavigation<any>();
  const {
    data,
    loading,
    setPage,
    hasMore,
    handleConfirm,
    deparments,
    user,
    downloadFile,
  } = useExpenseList();

  const renderItem = ({ item }: { item: (typeof data)[0] }) => {
    console.log(
      'item',
      item.Status === 0 &&
        user.PositionId === 1 &&
        item.DepartmentId === user.DepartmentId,
    );
    const nameDeparment = deparments.find(
      (dep: any) => dep.ID === item.DepartmentId,
    )?.Name;
    const nameType = expenseType.find(
      (elm) => `${elm.key}` === `${item.ExpenseType}`,
    )?.label;
    return (
      <View style={styles.itemContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <View>
            <Text style={styles.label}>
              Ngày tạo:{' '}
              <Text style={styles.value}>
                {moment(item.DateRequest).format('DD/MM/YYYY')}
              </Text>
            </Text>
            <Text style={styles.label}>
              Họ Tên: <Text style={styles.value}>{item.UserName}</Text>
            </Text>
          </View>
          <View>
            {item.Attachments && (
              <TouchableOpacity onPress={() => downloadFile(item.Attachments)}>
                <Ionicons name="download-sharp" size={30} color={'#24aadf'} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <View style={styles.wrapContent}>
            <Text style={styles.label}>
              Phòng ban: <Text style={styles.value}>{nameDeparment}</Text>
            </Text>
            <Text style={styles.label}>
              Số tiền:{' '}
              <Text style={styles.value}>{formatMoney(item.Amount)} (Vnđ)</Text>
            </Text>
            <Text style={styles.label}>
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
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center', // canh giữa theo chiều dọc
                alignItems: 'center', // canh giữa theo chiều ngang
              }}
            >
              {item?.Avata ? (
                <Image
                  source={{ uri: `${BASE_URL}${item.Avata}` }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.notAvatar}>
                  <Icon name="user" size={24} color="#3B82F6" />
                </View>
              )}
            </View>
            {((item.Status === 0 &&
              user.PositionId === 1 &&
              item.DepartmentId === user.DepartmentId) ||
              (item.Status === 2 &&
                item.Amount > 10000000 &&
                user.PositionId === 4) ||
              (item.Status === 1 &&
                item.Amount < 10000000 &&
                user.PositionId === 3)) &&
              item.Status !== 3 && (
                <View style={styles.btnFooter}>
                  <TouchableOpacity
                    style={styles.btnAccept}
                    onPress={() => handleConfirm(item, getNextStatus(item))}
                  >
                    <Text style={styles.txtAccept}>Chấp nhập</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnCancel}
                    onPress={() => handleConfirm(item, 4)}
                  >
                    <Text style={styles.txtAccept}>Từ chối</Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Danh sách phê duyệt kinh phí"
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
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 1,
    padding: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 3,
  },
  value: {
    fontSize: 14,
    color: '#555',
  },
  wrapContent: {
    gap: 3,
    width: '55%',
  },
  btnFooter: {
    alignContent: 'flex-end',
  },
  btnAccept: {
    backgroundColor: '#038cfc',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 5,
    flex: 1,
  },
  txtAccept: {
    color: '#fff',
    textAlign: 'center',
  },
  btnCancel: {
    backgroundColor: '#fc0349',
    borderRadius: 8,
    alignContent: 'center',
    marginTop: 10,
    paddingVertical: 5,
    flex: 1,
  },
  notAvatar: {
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: '#ccc', // xám nhạt
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 45,
    backgroundColor: '#eee',
    alignSelf: 'center',
  },
});

export default ExpenseList;
