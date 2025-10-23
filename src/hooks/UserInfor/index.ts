import request from '@/services/Request';
import { useState } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateAvatar, updateName } from '../../redux/slices/UserSlices';
import Toast from 'react-native-toast-message';
import moment from 'moment';

export const UseInfor = () => {
  const [form, setForm] = useState({
    Name: '',
    Avata: '',
    Position: '',
    Department: '',
    Gender: 0,
    DateOfBirth: '',
    Address: '',
    Email: '',
    PhoneNumber: '',
    DateOfJoining: '',
    IsActive: false,
    Status: null,
    RoleID: null,
    PositionId: null,
    ID: null,
    DepartmentId: null,
  });

  const [showCalendar, setShowCalendar] = useState<null | 'dob' | 'join'>(null);
  const useId = useSelector((state: any) => state.user.Id);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch();

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const showToast = () => {
    Toast.show({
      type: 'success', // 'success' | 'error' | 'info'
      text1: 'Bạn đã lưu thông tin thành công',
    });
  };
  const getUserInfor = async (id: any) => {
    try {
      const response = await request.get(
        `/api/Employee/getUserDetail?userId=${id}&pageIndex=1&pageSize=1`,
      );
      console.log('response', response);

      setForm(response.Data.Data);
    } catch (error) {}
  };

  const updateUser = async (data: any) => {
    console.log('data', data);

    try {
      const response = await request.post(
        `/api/Employee/addOrUpdateUser`,
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      console.log('update', response);

      dispatch(updateName(data.Name));
      showToast();
    } catch (error) {}
  };

  const uploadAvatar = async (uri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
      name: 'avatar.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('userId', useId);
    console.log('formData', formData);

    const res = await request.post('/api/Employee/addOrUpdateAvata', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setForm((prev) => {
      return {
        ...prev,
        Avata: res.Data.Avata,
      };
    });
    dispatch(updateAvatar(res.Data.Avata));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.Name.trim()) {
      newErrors.Name = 'Tên không được để trống';
    }
    if (form.Gender === null) {
      newErrors.Gender = 'Giới tính không được để trống';
    }
    if (form.Email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.Email)) {
        newErrors.Email = 'Email không hợp lệ';
      }
    } else {
      newErrors.Email = 'Email không được để trống';
    }
    if (form.PhoneNumber) {
      const phoneRegex = /^(?:\+84|0)(?:\d{9,10})$/;
      if (!phoneRegex.test(form.PhoneNumber)) {
        newErrors.PhoneNumber = 'Số điện thoại không hợp lệ';
      }
    } else {
      newErrors.PhoneNumber = 'Số điện thoại không được để trống';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = () => {
    if (validateForm()) {
      updateUser({
        Gender: form.Gender,
        PositionId: form.PositionId || '',
        Name: form.Name || '',
        DepartmentId: form.DepartmentId || '0',
        IsActive: form.IsActive,
        Status: form.Status || 0,
        DateOfJoining: form.DateOfJoining || '',
        Address: form.Address || '',
        PhoneNumber: form.PhoneNumber || '',
        ID: form.ID,
        Email: form.Email || '',
        Birthday:
          form.DateOfBirth ||
          moment(new Date()).format('YYYY-MM-DD[T]HH:mm:ss'),
      });
    }
    return;
  };
  return {
    getUserInfor,
    handleChange,
    showCalendar,
    form,
    setForm,
    setShowCalendar,
    updateUser,
    handleSave,
    uploadAvatar,
    errors,
  };
};
