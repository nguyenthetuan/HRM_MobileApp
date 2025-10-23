import { Platform as _Platform, PlatformIOSStatic } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import isCatalyst from '../is-catalyst';

import {
  PlataformSelectSpecificsEnhanced,
  PlatformName,
  PlatformRealOS,
  PlatformSelectOptions,
} from './index.shared';

export const PLATFORM_IOS = 'ios';
export const PLATFORM_ANDROID = 'android';

const isMacOS = !!(
  isCatalyst ||
  (_Platform as any).constants?.systemName?.toLowerCase().startsWith('mac')
);

const isNative = _Platform.OS !== 'web';

export const Platform = {
  ..._Platform,
  isNative: isNative,
  isDesktop: isMacOS,
  isElectron: false,
  deviceId: '',
  deviceName: '',
  androidLevel: 0,

  isMacOS,
  isPad: !!(_Platform as PlatformIOSStatic).isPad,
  isStandalone: true,
  OS: _Platform.OS as PlatformName,
  realOS: (isMacOS ? 'macos' : _Platform.OS) as PlatformRealOS,
  selectUsingRealOS<T>(
    specifics: PlataformSelectSpecificsEnhanced<T>,
    _options?: PlatformSelectOptions,
  ) {
    return Platform.realOS in specifics
      ? specifics[Platform.realOS]
      : _Platform.select(specifics);
  },
  supportsTouch: true,
  Version: _Platform.Version,
};

export const updatePlatform = async (): Promise<void> => {
  Object.assign(Platform, {
    deviceName: await DeviceInfo.getDeviceName(),
    deviceId: await DeviceInfo.getUniqueId(),
    androidLever: await DeviceInfo.getApiLevel(),
  });
};

export const isIOS = () => {
  return Platform.OS === PLATFORM_IOS;
};

export const isAndroid = () => {
  return Platform.OS === PLATFORM_ANDROID;
};

export const isMobile = () => {
  return Platform.OS === PLATFORM_ANDROID || Platform.OS === PLATFORM_IOS;
};

export const getAndroidVersion = () => {
  return DeviceInfo.getApiLevel();
};

export const isAboveIOS14 = () => {
  return isIOS() && parseFloat(Platform.Version as string) >= 14;
};
