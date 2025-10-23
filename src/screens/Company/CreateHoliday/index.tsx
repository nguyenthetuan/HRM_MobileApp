import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '@/components/header'; // Nếu bạn đang dùng Header riêng
import CommonDropdown from '@/components/SelectDropdow';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { useCreateHoliday } from '@/hooks/Company/CreateHoliday';

const CreateHoliday = () => {
  const {
    showDate,
    categorys,
    shift,
    navigation,
    Errors,
    setShowDate,
    user,
    formRequest,
    handleChange,
    onSubmit,
    common,
  } = useCreateHoliday();
  const formatMoney = (amount: string) => {
    if (!amount) return '';
    return parseInt(amount, 10);
  };
  return (
    <View style={styles.container}>
      <Header
        title="Tạo ngày nghỉ"
        onGoBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={styles.form}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View>
              <Text style={styles.label}>Loại Đơn</Text>
              <CommonDropdown
                data={categorys}
                defaultValue={formRequest.CategoryID}
                onSelect={(elm) => {
                  handleChange('CategoryID', elm.key);
                }}
              />
            </View>
            {Errors.CategoryID && (
              <Text style={styles.textError}>{Errors.CategoryID}</Text>
            )}
            {formRequest.CategoryID === 2 && (
              <View style={styles.shift}>
                <Text style={styles.label}>Chọn ca</Text>
                <CommonDropdown
                  data={shift}
                  onSelect={(elm) => {
                    handleChange('ShiftId', elm.key);
                  }}
                />
                {Errors.ShiftId && (
                  <Text style={styles.textError}>{Errors.ShiftId}</Text>
                )}
              </View>
            )}
            <Text style={styles.name}>Họ và tên</Text>
            <View style={styles.colum}>
              <Text style={styles.value}>{user.Name}</Text>
            </View>

            <Text style={styles.name}>Phòng ban</Text>
            <View style={[styles.colum]}>
              <Text style={styles.value}>
                {
                  common.deparments.find(
                    (elm: any) => elm.ID === user.DepartmentId,
                  )?.Name
                }
              </Text>
            </View>
            {(formRequest.CategoryID === 1 || formRequest.CategoryID === 4) && (
              <View style={styles.txtTime}>
                <Text style={styles.label}>Số phút</Text>
                <TextInput
                  style={styles.textTime}
                  value={`${formatMoney(formRequest.Time)}`}
                  onChangeText={(text) => handleChange('Time', text)}
                  keyboardType="numeric"
                />
                <Text style={styles.textError}>{Errors.Time}</Text>
              </View>
            )}
            <View style={styles.textAreaContainer}>
              <Text style={styles.label}>Lý do</Text>
              <TextInput
                style={styles.textArea}
                value={formRequest.Reason}
                onChangeText={(text) => handleChange('Reason', text)}
                maxLength={255}
                multiline
              />
              <Text style={styles.textError}>{Errors.Reason}</Text>
            </View>
            <View>
              <Text style={styles.label}>Chọn ngày</Text>
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => {
                  setShowDate(true);
                }}
              >
                <Icon name="calendar-outline" size={20} color="#333" />
                <Text style={styles.actionText}>
                  {moment(formRequest.DateRequest).format('DD/MM/YYYY')}
                </Text>
                <Icon name="add-outline" size={20} color="#888" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={() => onSubmit()}>
          <Text style={styles.saveText}>Tạo Đơn</Text>
        </TouchableOpacity>
      </ScrollView>
      <DatePicker
        modal
        open={!!showDate}
        date={new Date(formRequest.DateRequest)}
        onConfirm={(date) => {
          handleChange('DateRequest', moment(date).toISOString());
        }}
        onCancel={() => {
          setShowDate(false);
        }}
        // Đặt chế độ là 'date' để chọn ngày tháng năm
        mode="date"
        locale="vi"
        title={'Chọn ngày tháng'}
        style={{ flex: 1 }}
        minimumDate={new Date()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // nền sáng dịu
  },
  form: {
    padding: 16,
    flex: 1,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    borderColor: '#f1f1f1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
    paddingBottom: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    borderRadius: 8,
  },
  colum: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    borderColor: '#f1f1f1',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    borderRadius: 8,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151', // text xám đậm
    marginBottom: 6,
  },
  value: {
    fontSize: 15,
    color: '#6B7280', // text xám nhạt
  },
  textAreaContainer: {
    marginTop: 16,
  },
  txtTime: {
    marginTop: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 15,
    minHeight: 80,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
    backgroundColor: '#F9FAFB',
  },
  textTime: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 15,
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  counter: {
    textAlign: 'right',
    color: '#9CA3AF',
    fontSize: 12,
  },
  textError: {
    textAlign: 'left',
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
    paddingVertical: 14,
    gap: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
  },
  txtSuccess: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginTop: 60,
    marginBottom: 20,
  },
  saveText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151', // text xám đậm
    marginTop: 16,
    marginBottom: 6,
  },
  shift: {
    marginTop: 10,
  },
});

export default CreateHoliday;
