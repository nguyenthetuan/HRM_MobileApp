// src/navigation/RootNavigator.tsx
import React, { useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ApplicationNavigator from './Application';
import AuthNavigator from './AuthNavigator';
import { AuthContext } from './AuthContext';
import {
  requestLocationPermission,
  requestNotificationPermission,
} from '@/untils/permission/Permission';
import Geolocation from 'react-native-geolocation-service';
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert, Image, Platform, StatusBar, View } from 'react-native';
import request from '@/services/Request';
import { useDispatch, useSelector } from 'react-redux';
import { updateStatus } from '@/redux/slices/checkLocationDevice';
import { checkAndUpdateApp } from '@/untils/updateApp';
import { navigationRef, navigate } from './NavigationService'; // ✅ dùng ref
import { CommonActions } from '@react-navigation/native';

export default function RootNavigator() {
  const { userToken } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [isWaiting, setIsWaiting] = useState(true);
  const user = useSelector((state: any) => state.user);
  const getFcmToken = async (): Promise<string | null> => {
    try {
      // Kiểm tra quyền thông báo (chỉ cần với iOS)
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('Notification permission not granted');
        return null;
      }
      const token = await messaging().getToken();
      if (userToken) {
        const response = await request.post(
          `/api/FireBase/addOrUpdateFcmToken?userId=${user.Id}&fcmToken=${token}`,
        );
      }
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('remoteMessage', remoteMessage);
      if (user.PositionId !== 2) {
        //check !==2 là khác nhân viên
        Alert.alert(
          remoteMessage.notification?.title ?? 'Thông báo',
          remoteMessage.notification?.body ?? '',
          [
            {
              text: 'Đi tới danh sách duyệt đơn',
              onPress: async () => {
                userToken
                  ? remoteMessage?.data?.type === 'ExRequest'
                    ? navigate('ExpenseList')
                    : navigate('LeaveList')
                  : navigate('Login');
              },
            },
            { text: 'Hủy', style: 'cancel' },
          ],
        );
      }
    });
    // Khi app đang background và user tap vào notification
    const unsubscribeOpened = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log(
          '📩 Notification caused app to open from background state:',
          remoteMessage,
        );
      },
    );
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('📩 Message in background:', remoteMessage);
    });
    return () => {
      unsubscribe();
      unsubscribeOpened();
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage && user.PositionId !== 2) {
            //check !==2 là khác nhân viên
            console.log('📩 Open from quit:', remoteMessage);

            const target =
              remoteMessage?.data?.type === 'ExRequest'
                ? 'ExpenseList'
                : 'LeaveList';

            navigationRef.current?.dispatch(CommonActions.navigate(target));
          }
        });
    }, 2500); // đợi navigation chắc chắn ready

    return () => clearTimeout(timeout);
  }, []);

  const permissionLocationIos = async () => {
    const status = await Geolocation.requestAuthorization('whenInUse');
  };
  const requestPermissionsLocation = async () => {
    if (Platform.OS === 'android') {
      requestLocationPermission(true, true, (isGranted) => {
        if (isGranted) {
          Geolocation.getCurrentPosition(
            (position) => {
              console.log('position', position);
            },
            (error) => {
              dispatch(updateStatus(false));
              console.log(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        }
      });
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      Platform.OS === 'ios' && permissionLocationIos();
      requestPermissionsLocation();
    }, 1000); // chờ 1s để UI mount xong, đảm bảo dialog hiển thị được

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const requestPermissionsNotification = async () => {
      const notificationGranted = await requestNotificationPermission();
      if (notificationGranted) {
        await getFcmToken();
      }
    };
    requestPermissionsNotification();
  }, [user.Id]);

  useEffect(() => {
    if (isWaiting) {
      const timer = setTimeout(() => {
        setIsWaiting(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isWaiting]);

  if (isWaiting) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', backgroundColor: '#000' }}
      >
        <StatusBar barStyle={'dark-content'} />
        <Image
          source={require('../assets/images/splash_icon.png')}
          style={{ justifyContent: 'center', alignSelf: 'center' }}
        />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {userToken ? <ApplicationNavigator /> : <AuthNavigator />};
    </NavigationContainer>
  );
}
