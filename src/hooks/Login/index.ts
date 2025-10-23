import request from '@/services/Request';
import { useContext, useState } from 'react';
import { AuthContext } from '@/navigation/AuthContext';
import ReactNativeBiometrics from 'react-native-biometrics';
import { Alert } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { updateUserSlice } from '@/redux/slices/UserSlices';
import { useDispatch } from 'react-redux';
const rnBiometrics = new ReactNativeBiometrics();
const storage = new MMKV();
export const UseLogin = () => {
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const handleLogin = async (Username: any, Password: any) => {
    try {
      const data = {
        Username,
        Password,
        MacIp: '',
      };
      setIsLoading(true);
      const response = await request.post('/api/Home/loginCMS', data);
      console.log('response', response);
      dispatch(
        updateUserSlice({
          UserId: response.Data.User.ID,
          PositionId: response.Data.User.PositionId,
        }),
      );
      setIsLoading(false);

      if (response.Success) {
        login(response.Data.Token);
        storage.set('Username', Username);
        storage.set('Password', Password);
      } else {
        setError('Tài khoản hoặc mật khẩu không chính xác');
      }
    } catch (error) {
      setError('Tài khoản hoặc mật khẩu không chính xác');
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = () => {
    rnBiometrics.isSensorAvailable().then(({ available, biometryType }) => {
      if (
        available &&
        (biometryType === 'FaceID' ||
          biometryType === 'TouchID' ||
          biometryType === 'Biometrics')
      ) {
        rnBiometrics
          .simplePrompt({ promptMessage: 'Xác thực sinh trắc học' })
          .then((resultObject) => {
            const { success } = resultObject;
            if (success) {
              const useName = storage.getString('Username');
              const passWord = storage.getString('Password');
              handleLogin(useName, passWord);
            } else {
              Alert.alert('Thất bại', 'Xác thực bị hủy hoặc thất bại.');
            }
          })
          .catch(() => {
            Alert.alert('Lỗi', 'Không thể xác thực.');
          });
      } else {
        Alert.alert('Không hỗ trợ', 'Thiết bị không hỗ trợ sinh trắc học.');
      }
    });
  };
  return {
    handleLogin,
    error,
    isLoading,
    handleBiometricLogin,
  };
};
