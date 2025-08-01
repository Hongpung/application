import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Linking } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import {
  Alert,
  Color,
  Header,
  registerForPushNotificationsAsync,
  Switch,
  FullScreenLoadingModal,
} from "@hongpung/src/common";

import { useUpdateNotificationStatusRequest } from "@hongpung/src/features/notification/manageNotificationToken/api/notificationTokenApi";
import { notificationOffSuccessToast } from "@hongpung/src/features/notification/manageNotificationToken/lib/notificationOffSuccessToast";
import { notificationOnSuccessToast } from "@hongpung/src/features/notification/manageNotificationToken/lib/notificationOnSuccessToast";

const NotificationSettingPage: React.FC = () => {
  const { request: updateNotificationStatusRequest, isLoading } =
    useUpdateNotificationStatusRequest();
  const [isEnabled, setIsEnabled] = useState(false);
  const isEnabledRef = useRef(isEnabled);
  const isChangedRef = useRef(false);

  useEffect(() => {
    const loadSettings = async () => {
      const pushOption = await AsyncStorage.getItem("receive-push");
      setIsEnabled(pushOption === "true");
    };

    loadSettings();
  });

  useEffect(() => {
    isEnabledRef.current = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    return () => {
      if (isChangedRef.current) {
        const handleNotificationStatus = async () => {
          try {
            if (isEnabledRef.current) {
              const NToken = await registerForPushNotificationsAsync();
              await updateNotificationStatusRequest({
                pushEnable: true,
                notificationToken: NToken,
              });
              notificationOnSuccessToast();
            } else {
              await updateNotificationStatusRequest({
                pushEnable: false,
                notificationToken: null,
              });
              notificationOffSuccessToast();
            }
          } catch {
            Alert.alert(
              "오류",
              "알림 설정 변경에 실패했어요.\n다시 시도해주세요.",
            );
          }
        };

        // cleanup 함수에서는 async 직접 못 쓰니까 바로 실행
        handleNotificationStatus();
      }
    };
  }, [isEnabledRef, updateNotificationStatusRequest]);

  const toggleNotification = async () => {
    isChangedRef.current = true;
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "권한 거부",
        "알림 권한이 거부되었습니다. 시스템 설정에서 권한을 부여해야 알림을 받을 수 있습니다.",
        { confirmText: "확인", onConfirm: () => Linking.openSettings() },
      );
      return;
    }

    setIsEnabled((prev) => !prev);
    await AsyncStorage.setItem("receive-push", !isEnabled ? "true" : "false");
  };

  return (
    <View style={styles.container}>
      <Header headerName="알림 설정" LeftButton={"arrow-back"} />
      <FullScreenLoadingModal isLoading={isLoading} />
      <View style={styles.switchContainer}>
        <Text style={styles.label}>푸시 알림</Text>
        <Switch onChange={toggleNotification} value={isEnabled} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color["grey100"],
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 36,
    justifyContent: "space-between",
    paddingTop: 24,
  },
  label: {
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey700"],
    fontSize: 16,
  },
});

export default NotificationSettingPage;
