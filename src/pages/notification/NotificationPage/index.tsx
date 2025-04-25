import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";

import { Color, Header } from "@hongpung/src/common";

import { NotificationList } from "@hongpung/src/widgets/notification/ui/NotificationList/NotificationList";
import { FullScreenLoadingModal } from "@hongpung/src/common/ui/LoadingModal/FullScreenLoadingModal";
import {
  useDeleteAllNotificationsRequest,
  useDeleteNotificationRequest,
  useLoadNotificationsFetch,
  useReadAllNotificationsRequest,
} from "@hongpung/src/features/notification/manageNotification/api/notificationApi";
import { NotificationType } from "@hongpung/src/entities/notification/model/type";

const NotificationScreen: React.FC = () => {
  const { request: deleteNotification } = useDeleteNotificationRequest();
  const { request: handleDeleteAll } = useDeleteAllNotificationsRequest();
  const { request: readAll } = useReadAllNotificationsRequest();
  const [notificationList, setNotificationList] = useState<NotificationType[]>(
    []
  );
  const {
    data: notificationData,
    isLoading,
    error,
  } = useLoadNotificationsFetch();

  const handleDelete = async (notificationId: number) => {
    await deleteNotification({ notificationId });
    setNotificationList(
      notificationList.filter(
        (notification) => notification.notificationId !== notificationId
      )
    );
  };

  const lastReadNotification = useMemo(
    () => notificationData?.find((notification) => notification.isRead),
    [notificationData]
  );

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
      <Header headerName="알림" leftButton={"close"} />
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
          {notificationData && notificationData.length > 0 && (
            <Pressable
              onPress={() => {
                Alert.alert("확인", "알림을 모두 삭제할까요?", [
                  { text: "닫기" },
                  {
                    text: "삭제",
                    onPress: () => {
                      handleDeleteAll();
                      setNotificationList([]);
                    },
                  },
                ]);
              }}
            >
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
          data={notificationData}
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
    backgroundColor: "#FFF",
  },
});
