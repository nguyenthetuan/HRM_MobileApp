import { Platform, StatusBar } from 'react-native';

export const PADDING_TOP =
  Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ?? 0);
