import Header from '@/components/header';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { UseInfor } from '@/hooks/UserInfor';
import { useSelector } from 'react-redux';
import {
  requestCameraPermission,
  requestGalleryPermission,
} from '@/untils/permission/Permission';
import { Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { resizeToMaxSize } from '@/untils/resizeImage';
import { BASE_URL } from '@env';

const PersonInfor = () => {
  const {
    form,
    setShowCalendar,
    showCalendar,
    getUserInfor,
    handleChange,
    handleSave,
    uploadAvatar,
    errors,
  } = UseInfor();

  const navigation = useNavigation();
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    getUserInfor(user.Id);
  }, [user.Id]);
  const handlePickAvatar = (
    handleChange: (field: string, value: any) => void,
  ) => {
    Alert.alert('Chọn ảnh', 'Bạn muốn dùng ảnh từ đâu?', [
      {
        text: 'Chụp ảnh',
        onPress: async () => {
          const ok = await requestCameraPermission();
          if (!ok) {
            Alert.alert('Thông báo', 'Bạn chưa cấp quyền Camera.');
            return;
          }
          launchCamera({ mediaType: 'photo' }, async (res: any) => {
            console.log('size', await resizeToMaxSize(res.assets[0].uri));
            const uri = await resizeToMaxSize(res.assets[0].uri);
            if (!res.didCancel && res.assets?.[0]) {
              handleChange('Avata', uri);
            }
          });
        },
      },
      {
        text: 'Chọn từ thư viện',
        onPress: async () => {
          const ok = await requestGalleryPermission();
          if (!ok) {
            Alert.alert('Thông báo', 'Bạn chưa cấp quyền Thư viện ảnh.');
            return;
          }
          launchImageLibrary({ mediaType: 'photo' }, async (res: any) => {
            const uri = await resizeToMaxSize(res.assets[0].uri);
            if (!res.didCancel && res.assets?.[0]) {
              handleChange('Avata', uri);
            }
          });
        },
      },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // để tránh bị đè
      >
        <Header
          title="Chỉnh Sửa Thông Tin"
          onGoBack={() => navigation.goBack()}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() =>
              handlePickAvatar((res, value) => {
                uploadAvatar(value);
              })
            }
            disabled
          >
            {form?.Avata ? (
              <Image
                source={{ uri: `${BASE_URL}${form?.Avata}` }}
                style={styles.avatar}
              />
            ) : (
              <Icon name="account-circle" size={100} color="#ccc" />
            )}
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              value={form?.Name}
              onChangeText={(text) => handleChange('Name', text)}
              editable={false}
            />
            {errors?.Name && (
              <Text style={styles.txtError}>{errors?.Name}</Text>
            )}
            <Text style={styles.label}>Chức vụ</Text>
            <TextInput
              style={styles.input}
              value={form?.Position}
              onChangeText={(text) => handleChange('Position', text)}
              editable={false}
            />
            <Text style={styles.label}>Phòng ban</Text>
            <TextInput
              style={styles.input}
              value={form?.Department}
              onChangeText={(text) => handleChange('Department', text)}
              editable={false}
            />

            <Text style={styles.label}>Giới tính</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  form?.Gender === 0 && styles.genderSelected,
                ]}
                onPress={() => handleChange('Gender', 0)}
                disabled
              >
                <Text
                  style={[
                    styles.genderText,
                    { color: form?.Gender === 0 ? '#fff' : '#000' },
                  ]}
                >
                  Nam
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  form?.Gender === 1 && styles.genderSelected,
                ]}
                onPress={() => handleChange('Gender', 1)}
                disabled
              >
                <Text
                  style={[
                    styles.genderText,
                    { color: form?.Gender === 1 ? '#fff' : '#000' },
                  ]}
                >
                  Nữ
                </Text>
              </TouchableOpacity>
            </View>
            {errors?.Gender && (
              <Text style={styles.txtError}>{errors?.Gender}</Text>
            )}
            <Text style={styles.label}>Ngày sinh</Text>
            <TouchableOpacity
              onPress={() => setShowCalendar('dob')}
              style={styles.input}
              disabled
            >
              <Text>{moment(form?.DateOfBirth).format('DD/MM/YYYY')}</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={form?.Address}
              onChangeText={(text) => handleChange('Address', text)}
              secureTextEntry={false}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Nhập tài khoản"
              placeholderTextColor="#9ca3af"
              editable={false}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form?.Email}
              onChangeText={(text) => handleChange('Email', text)}
              keyboardType="email-address"
              editable={false}
            />
            {errors?.Email && (
              <Text style={styles.txtError}>{errors?.Email}</Text>
            )}
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={form?.PhoneNumber}
              onChangeText={(text) => handleChange('PhoneNumber', text)}
              keyboardType="phone-pad"
              editable={false}
            />
            {errors?.PhoneNumber && (
              <Text style={styles.txtError}>{errors?.PhoneNumber}</Text>
            )}
            <Text style={styles.label}>Ngày vào làm</Text>
            <TouchableOpacity
              onPress={() => setShowCalendar('join')}
              style={styles.input}
              disabled
            >
              <Text>
                {form?.DateOfJoining &&
                  moment(form?.DateOfJoining).format('DD/MM/YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleSave()}
          >
            <Text style={styles.saveText}>Lưu Thay Đổi</Text>
          </TouchableOpacity> */}
        </ScrollView>
      </KeyboardAvoidingView>
      <DatePicker
        modal
        open={!!showCalendar}
        date={new Date()}
        onConfirm={(date) => {
          console.log('date', date);

          if (showCalendar === 'dob') {
            handleChange(
              'DateOfBirth',
              moment(date).format('YYYY-MM-DD[T]HH:mm:ss'),
            );
            setShowCalendar(null);
          } else {
            handleChange(
              'DateOfJoining',
              moment(date).format('YYYY-MM-DD[T]HH:mm:ss'),
            );
            setShowCalendar(null);
          }
        }}
        onCancel={() => {
          setShowCalendar(null);
        }}
        // Đặt chế độ là 'date' để chọn ngày tháng năm
        mode="date"
        locale="vi"
        title={'Chọn ngày tháng'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 16, alignItems: 'center' },
  avatarContainer: { alignItems: 'center', marginBottom: 20, marginTop: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  label: { fontSize: 16, fontWeight: '600', marginTop: 12, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 6,
    backgroundColor: '#fafafa',
  },
  genderRow: { flexDirection: 'row', marginTop: 6 },
  genderButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  genderSelected: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  genderText: { color: '#fff', fontWeight: '500' },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Calendar modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontWeight: '600' },
  txtError: {
    color: 'red',
    fontSize: 14,
  },
});

export default PersonInfor;
