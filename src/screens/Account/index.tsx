import { useNavigation } from '@react-navigation/native';
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '@/navigation/AuthContext';
import { useSelector } from 'react-redux';
import { useMyAlert } from '@/components/AlertContext';
import request from '@/services/Request';
import { PADDING_TOP } from '@/untils/styleCommon';
import { BASE_URL } from '@env';
import messaging from '@react-native-firebase/messaging';

const Account: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login, logout } = useContext(AuthContext);
  const userInfor = useSelector((state: any) => state.user);

  const handleSettings = () => {
    navigation.navigate('Setting');
  };

  const PersonInfor = () => {
    navigation.navigate('PersonInfo');
  };

  const handleLogout = async () => {
    const token = null;
    logout();
    const response = await request.post(
      `/api/FireBase/addOrUpdateFcmToken?userId=${userInfor.Id}&fcmToken=${token}`,
    );
    await messaging().deleteToken();
  };

  return (
    <View style={styles.container}>
      {/* Thông tin cá nhân */}
      <View style={styles.profile}>
        {userInfor.Avatar ? (
          <Image
            source={{ uri: `${BASE_URL}${userInfor.Avatar}` }}
            style={styles.avatar}
          />
        ) : (
          <Icon name="account-circle" size={100} color="#ccc" />
        )}
        <Text style={styles.name}>{userInfor.Name}</Text>
      </View>

      {/* Các nút chức năng */}
      {/* <TouchableOpacity style={styles.button} onPress={handleSettings}>
        <Icon name="settings" size={22} color="#333" />
        <Text style={styles.buttonText}>Cài đặt</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity style={styles.button} onPress={handleChangeLanguage}>
        <Icon name="language" size={22} color="#333" />
        <Text style={styles.buttonText}>Thay đổi ngôn ngữ</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.button} onPress={PersonInfor}>
        <Ionicons name="person" size={22} color="#333" />
        <Text style={styles.buttonText}>Thông tin cá nhân</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { marginTop: 20 }]}
        onPress={handleLogout}
      >
        <Icon name="logout" size={22} color="red" />
        <Text style={[styles.buttonText, { color: 'red' }]}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: PADDING_TOP,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  profile: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default Account;
