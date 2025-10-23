import request from '@/services/Request';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '@/navigation/AuthContext';
import ReactNativeBiometrics from 'react-native-biometrics';
import { Alert, Linking, Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { useDispatch, useSelector } from 'react-redux';
import { useMyAlert } from '@/components/AlertContext';
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';
import {
  updateAvatar,
  updateName,
  updateDeparmentId,
  updateUserSlice,
} from '../../redux/slices/UserSlices';
import { useFocusEffect } from '@react-navigation/native';
import { useAppForeground } from '../useAppForeground';
import { updateStatus } from '@/redux/slices/checkLocationDevice';
import { useAppBackground } from '../useBackground';

const storage = new MMKV();
export const UseHome = () => {
  const [attendent, setAttend] = useState<any>(null);
  const [loading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<any>(null);
  const ShiftId = useSelector((state: any) => state?.user?.ShiftId);

  const IdUser = useSelector((state: any) => state.user.Id);
  const Avatar = useSelector((state: any) => state.user.Avatar);
  const [userInfor, setUser] = useState<any>(null);
  const locationDevice = useSelector(
    (state: any) => state.locationDevice.status,
  );
  console.log('userInfor', userInfor);

  const dispatch = useDispatch();
  const { showAlert } = useMyAlert();

  const getAttendent = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await request.get(
        `/api/Attendance/getAttendance?date=${data.date}&userId=${data.useId}&latitude=${data.latitude}&longitude=${data.longitude}&pageIndex=1&pageSize=1`,
      );
      console.log('response', response);

      setIsLoading(false);
      setAttend(response.Data);
    } catch (error) {}
  };

  const addOrUpdateAttendRecord = async (data: any) => {
    try {
      console.log('data', data);

      setIsLoading(true);
      const response = await request.post(
        `/api/Attendance/addOrUpdateAttendanceRecord`,
        data,
      );
      getAttendent({
        useId: IdUser,
        date: moment(new Date()).format('YYYY-MM-DD'),
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        pageIndex: 1,
        pageSize: 1,
      });
      setIsLoading(false);
    } catch (error) {
      console.log('rrrr', error);
    }
  };

  const ensureLocationPermission = async () => {
    // Trường hợp này là trưởng hợp khi location của máy Ios không bật
    if (Platform.OS !== 'ios') return true;
    const status: any = await Geolocation.requestAuthorization('whenInUse');
    if (status === 'granted' || status === 'grantedWhenInUse') return true;
    if (status === 'denied' || status === 'restricted') {
      Alert.alert(
        'Cần quyền vị trí',
        'Vào Cài đặt để bật quyền vị trí cho ứng dụng.',
        [
          { text: 'Huỷ', style: 'cancel' },
          {
            text: 'Mở Cài đặt',
            onPress: () => Linking.openURL('app-settings:'),
          },
        ],
      );
      setAttend(null);
      return false;
    }
    if (status === 'disabled') {
      Alert.alert(
        'Dịch vụ vị trí đang tắt',
        'Hãy bật Location Services trong Cài đặt.',
        [
          { text: 'Huỷ', style: 'cancel' },
          {
            text: 'Mở Cài đặt',
            onPress: () => Linking.openURL('app-settings:'),
          },
        ],
      );
      setAttend(null);
      return false;
    }
    return false;
  };

  const handleCheckInOrCheckOut = async () => {
    const ok = await ensureLocationPermission();
    if (!ok) return;
    Geolocation.getCurrentPosition(
      async (position) => {
        showAlert({
          title: 'Xác nhận',
          message: 'Bạn có muốn thực hiện ',
          buttons: [
            { text: 'Huỷ', style: 'cancel' },
            {
              text: 'Chấp nhận',
              onPress: async () => {
                const now = new Date();
                await addOrUpdateAttendRecord({
                  UserId: IdUser,
                  AttendanceDate: moment(new Date()).format('YYYY-MM-DD'),
                  Latitude: position.coords.latitude,
                  Longitude: position.coords.longitude,
                  ShiftId: ShiftId,
                });
              },
            },
          ],
        });
      },
      (error) => {
        console.log(error);
        if (error.code === 2) {
          setAttend(null);
          dispatch(updateStatus(false));
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const useNameStorage = useMemo(() => {
    return storage.getString('Username');
  }, []);

  useEffect(() => {
    if (!useNameStorage) {
      Alert.alert(
        'Cảnh báo bảo mật',
        'Từ lần mở app tiếp theo, hệ thống sẽ tự động đăng nhập bằng sinh trắc học (vân tay/Face ID).',
        [{ text: 'Hủy', style: 'cancel' }, { text: 'Đã hiểu' }],
        { cancelable: true },
      );
    }
  }, []);

  useEffect(() => {
    locationDevice &&
      Geolocation.getCurrentPosition(
        (position) => {
          setPosition(position);
          getAttendent({
            useId: IdUser,
            date: moment(new Date()).format('YYYY-MM-DD'),
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            pageIndex: 1,
            pageSize: 1,
          });
        },
        (error) => console.log(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    try {
      const response = await request.get(
        `/api/Employee/getUserDetail?userId=${IdUser}&pageIndex=1&pageSize=1`,
      );
      dispatch(updateAvatar(response.Data.Data.Avata));
      dispatch(updateName(response.Data.Data.Name));
      dispatch(updateDeparmentId(response.Data.Data.DepartmentId));
      dispatch(
        updateUserSlice({
          UserId: response.Data.Data.ID,
          PositionId: response.Data.Data.PositionId,
          ShiftId: response.Data.Data.ShiftId,
        }),
      );
      setUser(response.Data.Data);
    } catch (error) {}
  };

  return {
    getAttendent,
    addOrUpdateAttendRecord,
    attendent,
    loading,
    setIsLoading,
    handleCheckInOrCheckOut,
    getUserDetail,
    userInfor,
    position,
    IdUser,
    setPosition,
    Avatar,
    setAttend,
    ensureLocationPermission,
  };
};
