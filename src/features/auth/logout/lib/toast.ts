import Toast from "react-native-toast-message";

const showLogOutToast = () => {
  Toast.show({
    type: "success",
    text1: "안전하게 로그아웃 되었어요",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
};

const showLogOutFailToast = () => {
  Toast.show({
    type: "error",
    text1: "로그아웃에 실패했어요\n 다시 시도해주세요",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
};

export { showLogOutFailToast, showLogOutToast };
