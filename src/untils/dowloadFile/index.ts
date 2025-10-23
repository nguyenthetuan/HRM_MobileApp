import { Platform, Share, ToastAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-blob-util';

const guessFileName = (url: string) => {
  try {
    const cleanUrl = url.trim();
    const [path, queryString] = cleanUrl.split('?', 2);
    if (queryString) {
      const queryParams = queryString.split('&');
      for (const param of queryParams) {
        const [key, value] = param.split('=');
        if (key === 'NameFile' && value) {
          return decodeURIComponent(value);
        }
      }
    }
    const last = path.split('/').pop();
    if (last && last.includes('.')) {
      return decodeURIComponent(last);
    }

    return `download_${Date.now()}`;
  } catch (err) {
    console.error('Invalid URL:', url, err);
    return `download_${Date.now()}`;
  }
};

const ensureDir = async (dirPath: string) => {
  const exists = await RNFS.exists(dirPath);
  if (!exists) await RNFS.mkdir(dirPath);
};

export async function downloadAndExport(url: string) {
  // iOS: Documents; Android: DownloadDirectoryPath (nếu muốn cũng dùng DocumentDirectoryPath cho đồng nhất)
  const baseDir = RNFS.DocumentDirectoryPath;
  await ensureDir(baseDir);
  const fileName = guessFileName(url);
  const finalPath = `${baseDir}/${fileName}`;
  // Tải về path tạm (để nếu fail không rác file đích)
  const tmpPath = `${RNFS.TemporaryDirectoryPath || baseDir}/${Date.now()}_${fileName}`;
  const { promise } = RNFS.downloadFile({
    fromUrl: url,
    toFile: tmpPath,
    // iOS không cần permission; Android có thể cần WRITE_EXTERNAL_STORAGE với API thấp
    // progress: (e) => console.log('progress', (e.bytesWritten / e.contentLength) * 100),
    // progressDivider: 5,
  });

  const result = await promise; // { statusCode, bytesWritten }
  if (result.statusCode < 200 || result.statusCode >= 300) {
    // xoá tạm
    try {
      await RNFS.unlink(tmpPath);
    } catch {}
    throw new Error(`Download failed with status ${result.statusCode}`);
  }

  // Move về file đích
  // Nếu trùng tên thì xoá cũ (tuỳ yêu cầu UX)
  const existed = await RNFS.exists(finalPath);
  if (existed) await RNFS.unlink(finalPath);
  await RNFS.moveFile(tmpPath, finalPath);

  // ===== iOS: Mở Share sheet để user chọn "Save to Files" =====
  if (Platform.OS === 'ios') {
    const fileUrl = 'file://' + finalPath; // RẤT QUAN TRỌNG
    try {
      await Share.share(
        {
          url: fileUrl,
          message: fileUrl, // iOS đôi khi cần có message để hiện đủ actions
          title: fileName,
        },
        {
          subject: fileName,
          dialogTitle: 'Chia sẻ hoặc Lưu vào Files',
          // excludedActivityTypes: [...] // nếu muốn rút gọn menu
        } as any,
      );
    } catch (e) {}
  } else {
    if (Platform.OS === 'android') {
      const destPath = `/storage/emulated/0/Download/${fileName}`;
      const res = await RNFetchBlob.config({
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: destPath, // 👈 lưu thẳng vào thư mục Download công khai
          title: fileName,
          mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          description: 'Đang tải file...',
        },
      }).fetch('GET', url);
      ToastAndroid.show('Dow load file thành công', 1000);
      return destPath;
    } else {
      const { DocumentDir } = RNFetchBlob.fs.dirs;
      const destPath = `${DocumentDir}/${fileName}`;
      const res = await RNFetchBlob.config({
        path: destPath,
        fileCache: true,
      }).fetch('GET', url);
      return destPath;
    }
  }

  return finalPath;
}
