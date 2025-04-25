import Toast from "react-native-toast-message";

export const notificationOffSuccessToast = () =>
  Toast.show({
    type: "success",
    text1: "알림이 해제됐어요.",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
