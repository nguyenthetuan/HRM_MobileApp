import { PERMISSIONS } from 'react-native-permissions';
import { Platform } from '../Platform';

export const PERMISSION_RESULTS = {
  UNAVAILABLE: 'unavailable',
  BLOCKED: 'blocked',
  DENIED: 'denied',
  GRANTED: 'granted',
  LIMITED: 'limited',
};

export type ResultMap = typeof PERMISSION_RESULTS;
type Values<T> = T[keyof T];
export type PermissionStatus = Values<ResultMap>;

export const locationPermission = Platform.select<any>({
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
});
