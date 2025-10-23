// Header.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'; // bạn có thể đổi Ionicons thành FontAwesome,...

interface HeaderProps {
  title: string;
  onGoBack?: () => void;
  rightButton?: React.ReactNode; // cho phép truyền 1 component (icon, text, button,...)
}

const Header: React.FC<HeaderProps> = ({ title, onGoBack, rightButton }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* GoBack */}
        {onGoBack ? (
          <TouchableOpacity onPress={onGoBack} style={styles.leftBtn}>
            <Entypo name="chevron-thin-left" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.leftBtn} /> // giữ chỗ để title luôn ở giữa
        )}

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Right Button */}
        <View style={styles.rightBtn}>{rightButton}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#24aadf',
    paddingTop: 15,
  },
  container: {
    // Để đảm bảo header có thể bao phủ toàn bộ vùng an toàn
    height: Platform.OS === 'ios' ? 50 : 56, // Chiều cao chuẩn cho Header trên cả hai nền tảng
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#24aadf',
    paddingVertical: 10,
  },
  leftBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Header;
