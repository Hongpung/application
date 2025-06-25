import Toast from "react-native-toast-message";

export const deleteCompleteToast = () => {
  Toast.show({
    type: "success",
    text1: "예약을 취소했어요",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 2000,
  });
};
