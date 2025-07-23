import { Pressable, View, Text, StyleSheet } from "react-native";

import { Color } from "@hongpung/src/common";

import { NotificationType } from "../../model/type";
import { calculateTimeDifference } from "../../lib/calculatgeTimeDifference";

type NotificationCardProps = {
  notification: NotificationType;
  onPress: () => void;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
}) => {
  return (
    <Pressable style={styles.notificationContainer} onPress={onPress}>
      <View style={styles.notificationContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{notification.data.title}</Text>
        </View>
        <Text style={styles.timestampText}>
          {calculateTimeDifference(new Date(notification.timestamp))}
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text
          style={[
            styles.bodyText,
            {
              color: notification.isRead ? Color["grey300"] : Color["grey600"],
            },
          ]}
        >
          {notification.data.body}
        </Text>
      </View>
    </Pressable>
  );
};

NotificationCard.displayName = "NotificationCard";

export default NotificationCard;

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: "#FFF",
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: Color["grey100"],
    borderRadius: 8,
  },
  notificationContent: {
    margin: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey400"],
  },
  timestampText: {
    fontSize: 12,
    height: 14,
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey300"],
  },
  bodyContainer: {
    marginHorizontal: 24,
    justifyContent: "center",
    height: 60,
  },
  bodyText: {
    textAlignVertical: "center",

    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
  },
});
