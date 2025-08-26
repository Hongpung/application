import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";

import { Alert, Color, Header } from "@hongpung/src/common";

import { NotificationList } from "@hongpung/src/widgets/notification/ui/NotificationList/NotificationList";

import {
  useDeleteAllNotificationsRequest,
  useLoadNotificationsFetch,
  useReadAllNotificationsRequest,
} from "@hongpung/src/features/notification/manageNotification/api/notificationApi";
import { useDeleteNotificationRequest } from "@hongpung/src/entities/notification";
import { NotificationType } from "@hongpung/src/entities/notification/model/type";

const NotificationScreen: React.FC = () => {
  const { request: deleteNotification } = useDeleteNotificationRequest();
  const { request: deleteAll } = useDeleteAllNotificationsRequest();
  const { request: readAll } = useReadAllNotificationsRequest();
  const [notificationList, setNotificationList] = useState<NotificationType[]>(
    [],
  );
  const { data: notificationData } = useLoadNotificationsFetch();

  const handleDelete = (notificationId: number) => {
    const deleteRequest = async (notificationId: number) => {
      try {
        await deleteNotification({ notificationId });
        setNotificationList((prev) =>
          prev.filter(
            (notification) => notification.notificationId !== notificationId,
          ),
        );
      } catch {
        Alert.alert("오류", "알림 삭제에 했어요.\n다시 시도해주세요.");
      }
    };
    deleteRequest(notificationId);
  };

  const lastReadNotification = useMemo(
    () => notificationData?.find((notification) => notification.isRead),
    [notificationData],
  );

  const handleDeleteAll = () => {
    console.log("handleDeleteAll");
    Alert.confirm("확인", "알림을 모두 삭제할까요?", {
      cancelText: "아니오",
      confirmText: "예",
      onConfirm: () => {
        deleteAll();
        setNotificationList([]);
      },
    });
  };

  useEffect(() => {
    if (notificationData) {
      setNotificationList(notificationData);
    }
  }, [notificationData]);

  useEffect(() => {
    readAll();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Header headerName="알림" LeftButton={"close"} />
      <View style={{ marginTop: 6 }} />
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginHorizontal: 28,
            marginVertical: 8,
          }}
        >
          {notificationList && notificationList.length > 0 && (
            <Pressable onPress={handleDeleteAll}>
              <Text
                style={{
                  fontFamily: "NanumSquareNeo-Regular",
                  color: Color["grey400"],
                  fontSize: 16,
                }}
              >
                전체 삭제
              </Text>
            </Pressable>
          )}
        </View>
        <NotificationList
          data={notificationList}
          handleDelete={handleDelete}
          lastReadNotificationId={lastReadNotification?.notificationId}
        />
      </View>
    </View>
  );
};

export default NotificationScreen;

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
    backgroundColor: Color["white"],
  },
});
