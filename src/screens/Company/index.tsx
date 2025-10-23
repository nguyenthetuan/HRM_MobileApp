import Header from '@/components/header';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
// position:{
//   1: Trưởng phòng,
//   2: Nhân viên,
//   3: Kế toán,
//   4: Giám đốc
// }
export const Company = () => {
  const navigation = useNavigation<any>();
  const user = useSelector((state: any) => state.user);
  console.log('user1111', user);

  return (
    <View style={styles.container}>
      <Header title="Sintecha" />

      <View style={styles.wrapHeader}>
        <View style={styles.wrapFinger}>
          <Image
            source={require('../../assets/images/fingerpint1.png')}
            style={styles.imageFinger}
          />
        </View>
        <View style={styles.wrapCheckin}>
          <Text style={styles.checkinTitle}>Check in</Text>
          <Text style={styles.checkinDate}>
            {moment(new Date()).format('DD/MM/YYYY')}
          </Text>
        </View>
      </View>

      <View style={styles.wrapContent}>
        <Text style={styles.txtOffice}>NƠI LÀM VIỆC</Text>
        <TouchableOpacity
          style={styles.wrapButton}
          onPress={() => {
            navigation.navigate('Employeer');
          }}
        >
          <View style={styles.wrapLeft}>
            <Image
              source={require('../../assets/images/employee.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.buttonText}>Danh sách Nhân viên</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        {(user.PositionId === 1 || user.PositionId === 4) && (
          <TouchableOpacity
            style={styles.wrapButton}
            onPress={() => {
              navigation.navigate('LeaveList');
            }}
          >
            <View style={styles.wrapLeft}>
              <Image
                source={require('../../assets/images/timekeeping.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>
                Danh sách phê duyệt nghỉ phép
              </Text>
            </View>
            <Feather name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        )}
        {user.PositionId !== 4 && (
          <TouchableOpacity
            style={styles.wrapButton}
            onPress={() => {
              navigation.navigate('MyLeaveList');
            }}
          >
            <View style={styles.wrapLeft}>
              <Image
                source={require('../../assets/images/calendar.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>Đơn xin nghỉ của tôi</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        )}
        {user.PositionId !== 4 && (
          <TouchableOpacity
            style={styles.wrapButton}
            onPress={() => {
              navigation.navigate('MyExpenseList');
            }}
          >
            <View style={styles.wrapLeft}>
              <Image
                source={require('../../assets/images/locker.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>Phê duyệt kinh phí của tôi</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        )}
        {(user.PositionId === 1 ||
          user.PositionId === 4 ||
          user.PositionId === 3) && (
          <TouchableOpacity
            style={styles.wrapButton}
            onPress={() => {
              navigation.navigate('ExpenseList');
            }}
          >
            <View style={styles.wrapLeft}>
              <Image
                source={require('../../assets/images/expense.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>
                Danh sách phê duyệt kinh phí
              </Text>
            </View>
            <Feather name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  wrapHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  wrapFinger: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFinger: {
    width: 40,
    height: 40,
    tintColor: '#fff',
  },
  wrapCheckin: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2563EB',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingLeft: 16,
    justifyContent: 'center',
    backgroundColor: '#E0F2FE',
  },
  checkinTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  checkinDate: {
    fontSize: 14,
    color: '#1E3A8A',
  },
  wrapContent: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  txtOffice: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 16,
    color: '#111827',
  },
  wrapButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  wrapLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 15,
    color: '#111827',
  },
});
