import { Color } from "@hongpung/src/common";
import { NotificationType } from "@hongpung/src/entities/notification/model/type";
import { StackActions, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Swipeable,{ SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { calculateTimeDifference } from "../../lib/calculatgeTimeDifference";

type NotificationCard = {
  notification: NotificationType;
  onDelete: () => void;
};

export const NotificationCard: React.FC<NotificationCard> = ({
  notification,
  onDelete,
}) => {
  
  const navigation = useNavigation();
  const [isSwiped, setIsSwiped] = useState(false); // Swipeable 상태 관리

  const renderRightActions = (
    _: SharedValue<number>,
    dragXParam: SharedValue<number>,
    swipeable: SwipeableMethods
  ) => {
    const rightActionAnimatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        dragXParam.value,
        [-100, -50, 0],
        [1, 0.5, 0],
        "clamp"
      );
      return {
        opacity,
      };
    });

    return (
      <Pressable
        style={styles.rightAction}
        onPress={() => {
          onDelete();
          swipeable.close();
        }}
      >
        <Animated.View
          style={[styles.rightActionView, rightActionAnimatedStyle]}
        >
          <Text style={styles.rightActionText}>삭제</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      rightThreshold={40} // 오른쪽 스와이프 임계값
      friction={1.5} // 스와이프 감도 조절
      overshootRight={false}
      onSwipeableWillClose={() => setIsSwiped(false)}
      onSwipeableOpenStartDrag={() => setIsSwiped(true)}
    >
      <Animated.View style={[styles.NotificationCard]}>
        <Pressable
          onPress={() => {
            if (isSwiped) return;
            else if (notification.data.data?.reservationId) {
              const { reservationId } = notification.data.data;
              navigation.goBack();
              navigation.dispatch(
                StackActions.push("Reservation", {
                  screen: "ReservationDetail",
                  params: { reservationId },
                })
              );
            } else if (notification.data.data?.noticeId) {
              const { noticeId } = notification.data.data;
              navigation.goBack();
              navigation.dispatch(
                StackActions.push("NoticeStack", {
                  screen: "NoticeDetail",
                  params: { noticeId },
                })
              );
            }
          }}
        >
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
                  color: notification.isRead
                    ? Color["grey300"]
                    : Color["grey600"],
                },
              ]}
            >
              {notification.data.body}
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
    overflow: "scroll",
  },
  NotificationCard: {
    marginHorizontal: 28,
    marginVertical: 6,
    flex: 1,
    height: 120,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Color["grey100"],
    backgroundColor: "#FFF",
  },
  rightAction: {
    justifyContent: "center",
    alignItems: "center",
  },
  rightActionView: {
    flex: 1,
    backgroundColor: Color["red500"],
    marginVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 28,
    marginLeft: -20,
    borderRadius: 5,
    width: 140,
  },
  rightActionText: {
    textAlign: "center",
    width: 140,
    color: Color["red100"],
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
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
