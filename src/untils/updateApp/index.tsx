import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

const MANIFEST_URL =
  'https://nguyenthetuan.github.io/upload-OTA-HRM/dist/manifest.json';

const LOCAL_BUNDLE_PATH =
  RNFS.DocumentDirectoryPath +
  (Platform.OS === 'android' ? '/index.android.bundle' : '/index.ios.bundle');

const LOCAL_VERSION_PATH = RNFS.DocumentDirectoryPath + '/bundle-version.json';
const LOCAL_ASSETS_DIR = RNFS.DocumentDirectoryPath + '/assets';

// Lấy version hiện tại (lưu ở local)
async function getLocalVersion(): Promise<string> {
  try {
    const exists = await RNFS.exists(LOCAL_VERSION_PATH);
    if (exists) {
      const content = await RNFS.readFile(LOCAL_VERSION_PATH, 'utf8');
      return JSON.parse(content).version || '0.0.0';
    }
    return '0.0.0';
  } catch {
    return '0.0.0';
  }
}

// Lưu version mới khi tải về
async function saveLocalVersion(version: string) {
  await RNFS.writeFile(LOCAL_VERSION_PATH, JSON.stringify({ version }), 'utf8');
}

// Hàm tải assets
async function downloadAssets(assetsUrl: string, assetList: string[]) {
  try {
    const exists = await RNFS.exists(LOCAL_ASSETS_DIR);
    if (!exists) {
      await RNFS.mkdir(LOCAL_ASSETS_DIR);
    }

    for (const name of assetList) {
      const url = assetsUrl + name;
      const dest = LOCAL_ASSETS_DIR + '/' + name;
      console.log('⬇️ Tải asset:', url);

      await RNFS.downloadFile({
        fromUrl: url,
        toFile: dest,
      }).promise;
    }

    console.log('✅ Assets đã tải xong:', LOCAL_ASSETS_DIR);
  } catch (err) {
    console.error('❌ Lỗi tải assets:', err);
  }
}

// Hàm update OTA (bundle + assets)
export async function checkAndUpdateApp() {
  try {
    console.log('🔄 Kiểm tra manifest:', MANIFEST_URL);

    const res = await fetch(MANIFEST_URL);
    const manifest = await res.json();

    const remoteVersion = manifest.version;
    const localVersion = await getLocalVersion();

    console.log('📌 Local version:', localVersion);
    console.log('📌 Remote version:', remoteVersion);

    if (remoteVersion !== localVersion) {
      console.log('🚀 Có phiên bản mới, đang tải về...');

      const bundleUrl =
        Platform.OS === 'android'
          ? manifest.android.bundleUrl
          : manifest.ios.bundleUrl;

      const assetsUrl =
        Platform.OS === 'android'
          ? manifest.android.assetsUrl
          : manifest.ios.assetsUrl;

      // Nếu manifest có danh sách file assets
      const assetList = manifest.assets || []; // ví dụ: ["logo.png", "icon.png"]

      // Xóa bundle cũ nếu có
      const exists = await RNFS.exists(LOCAL_BUNDLE_PATH);
      if (exists) {
        await RNFS.unlink(LOCAL_BUNDLE_PATH);
      }

      // Tải bundle mới
      await RNFS.downloadFile({
        fromUrl: bundleUrl,
        toFile: LOCAL_BUNDLE_PATH,
      }).promise;

      // Tải assets mới
      if (assetList.length > 0) {
        await downloadAssets(assetsUrl, assetList);
      }

      // Lưu version mới
      await saveLocalVersion(remoteVersion);

      console.log('✅ Đã tải bundle + assets mới');
      console.log('👉 Hãy khởi động lại app để áp dụng.');
    } else {
      console.log('👌 App đang ở phiên bản mới nhất.');
    }
  } catch (e) {
    console.error('❌ Lỗi khi update app:', e);
  }
}
