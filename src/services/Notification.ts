import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import * as navigation from './NavigationService';
import * as Routes from 'src/constants/routes';
import { Platform } from 'react-native';

const enum NOTIFICATION_TYPE {
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  NEW_PROPERTY = 'NEW_PROPERTY',
  SCHEDULE_TOUR = 'SCHEDULE_TOUR',
  CHAT_CLAIM = 'CHAT_CLAIM',
  PROPERTY_CLAIM = 'PROPERTY_CLAIM',
}

const Notification = {
  async requestUserPermission(callback): Promise<void> {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await this.getFcmToken(callback);
      console.log('Authorization status:', authStatus);
    }
  },
  async getFcmToken(callback): Promise<void> {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
      callback(fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  },

  setBadge(badge: number = 0): void {
    notifee.setBadgeCount(badge).then(() => console.log(`Badge count set ${badge}!`));
  },

  createNotificationListeners(): void {
    messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));

      const notification = {
        id: remoteMessage.messageId,
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        ios: {},
        android: {},
      };

      if (Platform.OS === 'android') {
        notification.android = {
          channelId: !!remoteMessage.notification.android.sound ? 'sound_channel' : 'mute_channel',
          smallIcon: 'ic_stat_name',
        };
      }

      // @ts-ignore
      if (!!remoteMessage.notification.sound) {
        notification.ios = {
          // @ts-ignore
          sound: remoteMessage.notification.sound,
        };
      }

      notifee.displayNotification(notification);

      notifee.onForegroundEvent(({ type, detail }) => {
        switch (type) {
          case EventType.DISMISSED:
            console.log('User dismissed notification', detail.notification);
            break;
          case EventType.PRESS:
            console.log('User pressed notification', detail.notification);
            this.handleNotificationEvent(remoteMessage.data);
            break;
        }
      });
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
      this.handleNotificationEvent(remoteMessage.data);
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      console.log(remoteMessage.data.type); // TODO: redirect when user click on push notification (when app background)

      this.handleNotificationEvent(remoteMessage.data);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
          this.handleNotificationEvent(remoteMessage.data);
        }
      });
  },

  handleNotificationEvent(data) {
    const { notificationType } = data;
    switch (notificationType) {
      case NOTIFICATION_TYPE.CHAT_MESSAGE:
      case NOTIFICATION_TYPE.SCHEDULE_TOUR: {
        return navigation.navigate(Routes.Chat, { propertyId: data.propertyId, userId: parseInt(data.userId, 10) });
      }
      case NOTIFICATION_TYPE.NEW_PROPERTY: {
        return navigation.navigate(Routes.PropertyDetails, { propertyId: parseInt(data.propertyId, 10) });
      }
      case NOTIFICATION_TYPE.CHAT_CLAIM: {
        if (data?.status === 'declined') {
          return navigation.navigate(Routes.Chat, { propertyId: parseInt(data.propertyId, 10), userId: parseInt(data.userId, 10) });
        }
      }
      case NOTIFICATION_TYPE.PROPERTY_CLAIM: {
        if (data?.status === 'declined') {
          return navigation.navigate(Routes.PropertyDetails, { propertyId: parseInt(data.propertyId, 10) });
        }
      }
      default: {
        return;
      }
    }
  },
};

export default Notification;
