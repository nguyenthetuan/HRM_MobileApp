import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import Header from '@/components/header';
import { useCreateExpense } from '@/hooks/Company/CreateExpense';
import CommonDropdown from '@/components/SelectDropdow';
import { expenseType } from '@/untils/data';
import ModalSelectEmployeer from './compoents/ModalSelectEmployeer';
import { BASE_URL } from '@env';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const CreateExpense = () => {
  const {
    navigation,
    Errors,
    user,
    formRequest,
    handleChange,
    onSubmit,
    common,
    handlePickFile,
    selectedFile,
    handleSelectFollower,
  } = useCreateExpense();

  const refModal = useRef<any>(null);
  const employeers = useSelector((state: any) => state.common.employeers);
  const formatMoney = (amount: string) => {
    if (!amount) return '';
    return parseInt(amount, 10).toLocaleString();
  };
  const showModal = () => {
    refModal.current.openModal();
  };
  const employeerMap = React.useMemo(() => {
    const map = new Map();
    employeers.forEach((e: any) => map.set(e.ID, e));
    return map;
  }, [employeers]);

  return (
    <KeyboardAwareScrollView
      bottomOffset={30} // khoảng đệm giữa keyboard và input
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Header
        title="Tạo đơn xin kinh phí"
        onGoBack={() => navigation.goBack()}
      />

      <View style={styles.form}>
        {/* Loại kinh phí */}
        <View>
          <Text style={styles.label}>Loại kinh phí</Text>
          <CommonDropdown
            data={expenseType}
            defaultValue={formRequest.ExpenseType}
            onSelect={(elm) => handleChange('ExpenseType', elm.key)}
          />
          {Errors.ExpenseType && (
            <Text style={styles.textError}>{Errors.ExpenseType}</Text>
          )}
        </View>

        {/* Số tiền */}
        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>Số tiền</Text>
          <TextInput
            style={styles.textMoney}
            value={formatMoney(formRequest?.Amount)}
            onChangeText={(text) => handleChange('Amount', text)}
            keyboardType="numeric"
          />
          {Errors.Amount && (
            <Text style={styles.textError}>{Errors.Amount}</Text>
          )}
        </View>

        {/* Họ và tên */}
        <Text style={styles.name}>Họ và tên</Text>
        <View style={styles.row}>
          <Text style={styles.value}>{user.Name}</Text>
        </View>

        {/* Phòng ban */}
        <Text style={styles.name}>Phòng ban</Text>
        <View style={styles.row}>
          <Text style={styles.value}>
            {
              common.deparments.find((elm: any) => elm.ID === user.DepartmentId)
                ?.Name
            }
          </Text>
        </View>

        {/* Lý do */}
        <View style={styles.textAreaContainer}>
          <Text style={styles.label}>Lý do</Text>
          <TextInput
            style={styles.textArea}
            value={formRequest.Reason}
            onChangeText={(text) => handleChange('Reason', text)}
            maxLength={255}
            multiline
          />
          {Errors.Reason && (
            <Text style={styles.textError}>{Errors.Reason}</Text>
          )}
        </View>
        {/* Người theo dõi */}
        <Text style={styles.name}>Người theo dõi</Text>
        <TouchableOpacity style={styles.row} onPress={() => showModal()}>
          <Text>Chọn người theo dõi</Text>
        </TouchableOpacity>
        {formRequest?.ListUserNotify?.length > 0 && (
          <View style={styles.selectedList}>
            {formRequest?.ListUserNotify?.map((IdUser: any) => {
              const employeer = employeerMap.get(IdUser);
              if (!employeer) return null;
              return (
                <View key={employeer.ID} style={styles.avatarItem}>
                  <View>
                    {employeer.Avata ? (
                      <Image
                        source={{ uri: `${BASE_URL}${employeer.Avata}` }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View style={styles.notAvatar}>
                        <Icon name="user" size={24} color="#3B82F6" />
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.removeIcon}
                      onPress={() => handleSelectFollower(employeer)}
                    >
                      <Text style={styles.removeText}>×</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.avatarName} numberOfLines={1}>
                    {employeer.Name}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
        {Errors.FollowerId && (
          <Text style={styles.textError}>{Errors.FollowerId}</Text>
        )}
        {/* Chọn file */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.label}>File đính kèm</Text>
          <TouchableOpacity style={styles.fileButton} onPress={handlePickFile}>
            <Text style={styles.fileText}>Chọn file</Text>
          </TouchableOpacity>
          {selectedFile && (
            <Text style={styles.selectedFile}>
              {selectedFile[0].name || selectedFile.uri}
            </Text>
          )}
        </View>
        {/* Nút tạo đơn */}
        <TouchableOpacity style={styles.saveButton} onPress={() => onSubmit()}>
          <Text style={styles.saveText}>Tạo Đơn</Text>
        </TouchableOpacity>
      </View>
      <ModalSelectEmployeer
        ref={refModal}
        onChange={(value: any) => handleSelectFollower(value)}
        selectedFollower={formRequest.ListUserNotify}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  dropdow: {},
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 16, flex: 1, backgroundColor: '#fff' },
  row: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  value: { fontSize: 15, color: '#6B7280' },
  textAreaContainer: { marginTop: 16 },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 15,
    minHeight: 80,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    textAlignVertical: 'top',
  },
  textMoney: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 15,
    minHeight: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textError: {
    textAlign: 'left',
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  saveText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  fileButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  fileText: {
    color: '#374151',
    fontSize: 15,
  },
  selectedFile: {
    marginTop: 8,
    fontSize: 14,
    color: '#2563EB',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
  },
  avatarName: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    marginTop: 4,
    width: 60,
  },
  removeIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  avatar: { width: 26, height: 26, borderRadius: 13, marginRight: 6 },
  avatarItem: {
    alignItems: 'center',
    width: 64,
  },
  notAvatar: {
    width: 30,
    height: 30,
    borderRadius: 60,
    marginRight: 16,
    backgroundColor: '#ccc', // xám nhạt
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateExpense;
