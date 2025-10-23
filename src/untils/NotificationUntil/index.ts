import firebase from '@react-native-firebase/app';

async function onForegroundMessage(message: any): Promise<void> {}

export async function onOpenFromNotification(data: any) {}
export async function setBadgeCount(count: number) {}
async function onBackgroundMessage(message: any): Promise<void> {}
export async function notificationInit(): Promise<void> {
  console.log('CheckNotification notificationInit');
  firebase.messaging().onMessage(onForegroundMessage);

  firebase.messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      'onNotificationOpenedApp caused app to open from background state:',
      JSON.stringify(remoteMessage),
    );
    onOpenFromNotification(remoteMessage.data);
    // navigation.navigate(remoteMessage.data.type);
  });

  firebase.messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background 1', remoteMessage);
    console.log(
      'setBackgroundMessageHandler',
      remoteMessage?.data?.badge_number,
    );
    if (remoteMessage?.data?.badge_number) {
      setBadgeCount(Number(remoteMessage?.data?.badge_number ?? 0));
    }
    onBackgroundMessage(remoteMessage);
  });

  // const initialNotification = await Notifee.getInitialNotification()
  // console.log('CheckNotification init: ', { initialNotification })
}
