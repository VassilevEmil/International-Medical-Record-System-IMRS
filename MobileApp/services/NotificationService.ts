import { Platform, PermissionsAndroid } from "react-native";
import PushNotification from "react-native-push-notification";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

class NotificationService {
  async requestPermissions() {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: "Notification Permission",
            message: "This app needs access to your notifications",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        const checkPermissions = async () => {
          if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            if (!granted) {
              await this.requestPermissions();
            }
          } else if (Platform.OS === "ios") {
            const result = await check(PERMISSIONS.IOS.NOTIFICATIONS);
            if (result !== RESULTS.GRANTED) {
              await this.requestPermissions();
            }
          }
        };

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use notifications");
        } else {
          console.log("Notification permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === "ios") {
      const result = await request(PERMISSIONS.IOS.NOTIFICATIONS);
      if (result === RESULTS.GRANTED) {
        console.log("You can use notifications");
      } else {
        console.log("Notification permission denied");
      }
    }
  }

  configurePushNotifications() {
    PushNotification.configure({
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
      },
      requestPermissions: Platform.OS === "ios",
    });
  }
}

export default new NotificationService();
