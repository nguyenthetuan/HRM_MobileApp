import { PermissionStatus } from '@/utils/permission/PermissionConstant';
import { PERMISSIONS } from 'react-native-permissions';

export const request = (permission: any): Promise<any> => {
  return new Promise((resolve) => {
    resolve('granted');
  });
};

export const check = (permission: any): Promise<any> => {
  return new Promise((resolve) => {
    resolve('granted');
  });
};

export const requestCameraPermission = (): Promise<PermissionStatus> =>
  new Promise((resolve) => {
    resolve('granted');
  });

export const requestLocationPermission = (): Promise<PermissionStatus> =>
  new Promise((resolve) => {
    resolve('granted');
  });

export const requestFileStoragePermission = (): Promise<PermissionStatus> =>
  new Promise((resolve) => {
    resolve('granted');
  });
