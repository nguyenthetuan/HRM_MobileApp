import Header from '@/components/header';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Setting = () => {
  const navigation = useNavigation();
  const [isFaceEnabled, setIsFaceEnabled] = useState(false);

  const toggleFaceRecognition = (value: boolean) => {
    setIsFaceEnabled(value);
    Alert.alert(
      'Thông báo',
      value ? 'Đã bật sử dụng khuôn mặt' : 'Đã tắt sử dụng khuôn mặt',
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Cài đặt" onGoBack={() => navigation.goBack()} />
      <View style={styles.settingRow}>
        <Icon name="face" size={24} color="#333" style={styles.icon} />
        <Text style={styles.label}>Cho phép sử dụng khuôn mặt</Text>
        <Switch value={isFaceEnabled} onValueChange={toggleFaceRecognition} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default Setting;
