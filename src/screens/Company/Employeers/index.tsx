import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '@/components/header';
import { useNavigation } from '@react-navigation/native';
import { useEmployeer } from '@/hooks/Employeers';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import { BASE_URL } from '@env';

const Employeers = () => {
  const navigation = useNavigation<any>();
  const { getEmployeers, employeers } = useEmployeer();
  const { user, common } = useSelector((state: any) => state);
  useEffect(() => {
    getEmployeers(user.DepartmentId);
  }, [user.DepartmentId]);
  const renderItem = ({ item }) => {
    const nameDeparment = common?.deparments?.find(
      (elm: any) => elm.ID === item.DepartmentId,
    )?.Name;
    const namePosition = common.positions.find(
      (elm: any) => elm.ID === item.PositionId,
    )?.Name;
    return (
      <View style={styles.card}>
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
        <View style={styles.info}>
          <Text style={styles.name}>{item.Name}</Text>
          <Text style={styles.detail}>Phòng ban: {nameDeparment}</Text>
          <Text style={styles.detail}>Vị trí: {namePosition}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Danh sách nhân viên"
        onGoBack={() => {
          navigation.goBack();
        }}
      />
      <FlatList
        data={employeers}
        keyExtractor={(item) => item.Id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default Employeers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },

  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#555',
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
});
