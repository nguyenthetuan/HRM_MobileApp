// Loading.js
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Loading = ({ visible = true, message = 'Đang tải...' }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', // Bao phủ toàn màn hình
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // mờ nền
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // nằm trên tất cả
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
