import { Permission } from 'react-native-permissions/src/types';
import {
  check,
  openSettings,
  PERMISSIONS,
  request as requestPermission,
  requestMultiple as requestMultiplePermissions,
} from 'react-native-permissions';
import {
  locationPermission,
  PERMISSION_RESULTS,
  PermissionStatus,
} from '@/untils/permission/PermissionConstant';
import { isAndroid, Platform } from '@/untils/Platform';
import { showAlertDialog } from '@/components/showAlertDialog';
import i18next from 'i18next';
import DeviceInfo from 'react-native-device-info';
import { Alert } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
const request = (permission: Permission): Promise<PermissionStatus> => {
  return requestPermission(permission);
};

const checkPermission = (permission: Permission): Promise<PermissionStatus> => {
  return check(permission);
};

const requestMultiple = (
  permission: Permission[],
): Promise<Record<number, PermissionStatus>> => {
  return requestMultiplePermissions(permission);
};

const cameraPermission = (): Promise<PermissionStatus> =>
  request(
    Platform.select<any>({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    }),
  );

function checkCameraStatus(
  status: string,
  isShowError?: boolean,
  isShowSetting?: boolean,
): boolean {
  switch (status) {
    case PERMISSION_RESULTS.UNAVAILABLE:
    case PERMISSION_RESULTS.DENIED:
    case PERMISSION_RESULTS.LIMITED:
      if (isShowError) {
        showAlertDialog({
          message: i18next.t('error_permission_camera'),
          buttons: [
            {
              text: i18next.t('btn_alert_dialog_ok'),
              onPress: () => {},
            },
          ],
        });
      }
      return false;
    case PERMISSION_RESULTS.GRANTED:
      return true;
    case PERMISSION_RESULTS.BLOCKED:
      if (isShowSetting) {
        showAlertDialog({
          message: i18next.t('error_permissions_camera_blocked'),
          buttons: [
            {
              text: i18next.t('btn_app_got_it'),
              onPress: () => {
                openSettings();
              },
            },
          ],
        });
      }
      return false;
  }
  return false;
}

export async function requestCameraPermission() {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export async function requestGalleryPermission() {
  if (Platform.OS !== 'android') return true;

  try {
    if (Platform.Version >= 33) {
      // Android 13+
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

const locationPermissionInternal = (): Promise<PermissionStatus> =>
  request(locationPermission);

export const requestLocationPermission = (
  isShowError?: boolean,
  isShowSetting?: boolean,
  result?: (isGranted: boolean) => void,
) => {
  locationPermissionInternal()
    .then((status) => {
      console.log('requestLocationPermission', status);
      switch (status) {
        case PERMISSION_RESULTS.UNAVAILABLE:
        case PERMISSION_RESULTS.DENIED:
        case PERMISSION_RESULTS.LIMITED:
          if (isShowError) {
            showAlertDialog({
              message: i18next.t('error_permission_location'),
              buttons: [
                {
                  text: i18next.t('btn_alert_dialog_ok'),
                  onPress: () => {
                    console.log('Cancel');
                  },
                },
              ],
            });
          }
          if (result) {
            result(false);
          }
          break;
        case PERMISSION_RESULTS.GRANTED:
          if (result) {
            result(true);
          }
          break;
        case PERMISSION_RESULTS.BLOCKED:
          if (isShowSetting) {
            Alert.alert(
              i18next.t('Thông báo'),
              i18next.t('Bạn cần cho phép app truy cập vị trí!'),
              [
                {
                  text: i18next.t('Đi tới cài đặt app'),
                  onPress: () => {
                    openSettings();
                  },
                },
              ],
            );
          }
          if (result) {
            result(false);
          }
          break;
      }
    })
    .catch((error) => {
      console.log('CheckPermission Error', error);
      if (isShowError) {
        showAlertDialog({
          message: i18next.t('error_permission_location'),
          buttons: [
            {
              text: i18next.t('btn_alert_dialog_ok'),
              onPress: () => {
                console.log('Cancel');
              },
            },
          ],
        });
        if (result) {
          result(false);
        }
      }
    });
};

/*{ 'ios.permission.CAMERA': 'granted',
  'ios.permission.PHOTO_LIBRARY': 'granted' }*/
const getPermissionResultByRecord = (record: any): string => {
  const data = Object.values(record) ?? {};
  console.log('getPermissionResultByRecord', data);
  console.log('getPermissionResultByRecord', record);
  // Kiểm tra nếu có phần tử nào có value = BLOCKED thì trả về BLOCKED
  if (data.includes(PERMISSION_RESULTS.BLOCKED)) {
    return PERMISSION_RESULTS.BLOCKED;
  }
  // Kiểm tra nếu có phần tử nào có value = DENIED hoặc UNAVAILABLE thì trả về giá trị đóK
  const deniedOrUnavailable = data.find(
    (value) =>
      value === PERMISSION_RESULTS.DENIED ||
      value === PERMISSION_RESULTS.UNAVAILABLE,
  );
  if (deniedOrUnavailable) {
    return `${deniedOrUnavailable}`;
  }

  if (data.includes(PERMISSION_RESULTS.LIMITED)) {
    return PERMISSION_RESULTS.LIMITED;
  }

  // Nếu không thoả mãn các điều kiện trên, trả về GRANTED
  return PERMISSION_RESULTS.GRANTED;
};

export const isGrantedLocationPermission = async () => {
  const [permission, isLocationEnabled] = await Promise.all([
    checkPermission(locationPermission),
    DeviceInfo.isLocationEnabled(),
  ]);
  return permission === 'granted' && isLocationEnabled;
};

const readContactPermission = async () => {
  return request(
    Platform.select<any>({
      android: PERMISSIONS.ANDROID.READ_CONTACTS,
      ios: PERMISSIONS.IOS.CONTACTS,
    }),
  );
};

export const isGrantedReadContactPermission = async () => {
  const result = await check(
    Platform.select<any>({
      android: PERMISSIONS.ANDROID.READ_CONTACTS,
      ios: PERMISSIONS.IOS.CONTACTS,
    }),
  );
  return result === PERMISSION_RESULTS.GRANTED;
};

export async function requestNotificationPermission() {
  if (Platform.OS === 'android') {
    // ✅ Android
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Android: Notification permission granted ✅');
        return true;
      } else {
        console.log('Android: Notification permission denied ❌');
        return false;
      }
    } else {
      // Android 12 trở xuống thì mặc định cho phép
      console.log('Android < 13: Permission granted by default ✅');
      return true;
    }
  } else {
    // ✅ iOS
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('iOS: Notification permission granted ✅');
      return true;
    } else {
      console.log('iOS: Notification permission denied ❌');
      return false;
    }
  }
}
