import Toast from "react-native-toast-message";

export const notificationOnSuccessToast = () =>
  Toast.show({
    type: "success",
    text1: "알림이 설정됐어요.",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
