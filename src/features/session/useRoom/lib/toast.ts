import Toast from "react-native-toast-message";

const extendSessionSuccessToast = () => {
  Toast.show({
    type: "success",
    text1: "이용 시간이 연장되었어요",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
};

export { extendSessionSuccessToast };
