import { NotificationType } from "@hongpung/src/entities/notification/model/type";
import { NotificationCard } from "@hongpung/src/features/notification/manageNotification/ui/NotificationCard/NotificationCard";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";

import { Color } from "@hongpung/src/common";
import { View, Text, StyleSheet } from "react-native";
import React from "react";

type NotificationListProps = {
  data: NotificationType[];
  handleDelete: (notificationId: number) => void;
  lastReadNotificationId?: number;
};

export const NotificationList: React.FC<NotificationListProps> = ({
  data,
  handleDelete,
  lastReadNotificationId,
}) => {
  return (
    <GestureHandlerRootView>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <>
            {item.notificationId == lastReadNotificationId && (
              <View key={"latest-line"} style={styles.latestLine}>
                <View style={styles.separator} />
                <Text style={styles.previousNotificationText}>
                  이전 알림
                </Text>
                <View style={styles.separator} />
              </View>
            )}
            <NotificationCard
              notification={item}
              onDelete={() => {
                handleDelete(item.notificationId);
              }}
            />
          </>
        )}
        keyExtractor={(item) => item.notificationId.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              새로운 알림이 없습니다.
            </Text>
          </View>
        }
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  latestLine: {
    backgroundColor: "transparent",
    marginVertical: 4,
    marginHorizontal: 36,
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    height: 0,
    borderWidth: 0.6,
    flex: 1,
    borderColor: Color["grey200"],
  },
  previousNotificationText: {
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey300"],
  },
  emptyContainer: {
    flex: 1,
    height: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey400"],
    fontSize: 16,
  },
});
