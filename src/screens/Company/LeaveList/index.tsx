import Header from '@/components/header';
import { useLeaveList } from '@/hooks/Company/LeaveList';
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
import { BASE_URL } from '@env';

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

const LeaveList = () => {
  const navigation = useNavigation<any>();
  const { data, loading, setPage, hasMore, handleConfirm, categorys } =
    useLeaveList();

  const renderItem = ({ item }: { item: (typeof data)[0] }) => {
    const typeName = categorys?.find(
      (elm) => elm.key === item.CategoryID,
    )?.label;
    return (
      <View style={styles.itemContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={styles.wrapContent}>
            <Text style={styles.label}>
              Họ Tên: <Text style={styles.value}>{item.UserName}</Text>
            </Text>
            <Text style={styles.label}>
              Ngày:{' '}
              <Text style={styles.value}>
                {moment(item.DateRequest).format('DD/MM/YYYY')}
              </Text>
            </Text>
            <Text style={styles.label}>
              Thời gian nghỉ: <Text style={styles.value}>{item.Time}</Text>
            </Text>

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
          {item.Avata ? (
            <Image
              source={{ uri: `${BASE_URL}${item.Avata}` }}
              style={styles.avatar}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.notAvatar}>
              <Icon name="user" size={24} color="#3B82F6" />
            </View>
          )}
        </View>
        {item.Status !== 1 && item.Status !== 2 && (
          <View style={styles.btnFooter}>
            <TouchableOpacity
              style={styles.btnAccept}
              onPress={() => handleConfirm(item, 1)}
            >
              <Text style={styles.txtAccept}>Chấp nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={() => handleConfirm(item, 2)}
            >
              <Text style={styles.txtAccept}>Từ chối</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Danh sách phê duyệt nghỉ phép"
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
  btnFooter: {
    flexDirection: 'row',
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
    marginLeft: 15,
    marginTop: 10,
    paddingVertical: 5,
    flex: 1,
  },
  notAvatar: {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginRight: 16,
    backgroundColor: '#ccc', // xám nhạt
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 45,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
});

export default LeaveList;
