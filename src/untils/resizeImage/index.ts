import { Platform } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import RNFS, { stat } from 'react-native-fs';

const MAX_SIZE = 1 * 1024 * 1024; // giới hạn đẩy anh lên 5MB

/**
 * Convert iOS "ph://" uri to a real file path using RNFS
 */
const getIOSFilePath = async (uri: string): Promise<string> => {
  if (uri.startsWith('ph://')) {
    // Copy photo asset to a tmp directory
    const destPath = `${RNFS.TemporaryDirectoryPath}${Math.random()
      .toString(36)
      .substring(7)}.jpg`;
    await RNFS.copyAssetsFileIOS(uri, destPath, 0, 0);
    return destPath;
  }
  return uri;
};

/**
 * Resize image to ensure it's <= MAX_SIZE
 * Works on both Android & iOS
 */
export const resizeToMaxSize = async (uri: string): Promise<string> => {
  try {
    // 1. Chuẩn hóa uri
    let inputUri = uri;
    if (Platform.OS === 'android') {
      inputUri = inputUri.replace('file://', ''); // RNFS.stat cần path sạch
    } else if (Platform.OS === 'ios') {
      inputUri = await getIOSFilePath(inputUri);
    }

    let quality = 80;
    let width = 1920; // max width mong muốn
    let height = 1080; // max height mong muốn

    // 2. Resize ban đầu
    let resized = await ImageResizer.createResizedImage(
      inputUri,
      width,
      height,
      'JPEG',
      quality,
    );

    let fileInfo = await stat(resized.uri.replace('file://', ''));

    // 3. Vòng lặp giảm size cho đến khi < MAX_SIZE hoặc quality thấp nhất
    while (fileInfo.size > MAX_SIZE && quality > 10) {
      quality -= 10;
      width = Math.floor(width * 0.9);
      height = Math.floor(height * 0.9);

      resized = await ImageResizer.createResizedImage(
        inputUri,
        width,
        height,
        'JPEG',
        quality,
      );

      fileInfo = await stat(resized.uri.replace('file://', ''));
    }

    // 4. Trả về uri (Android: thêm file:// cho upload)
    const finalUri =
      Platform.OS === 'android'
        ? `file://${resized.uri.replace('file://', '')}`
        : resized.uri;

    return finalUri;
  } catch (err) {
    console.error('resizeToMaxSize error:', err);
    throw err;
  }
};
