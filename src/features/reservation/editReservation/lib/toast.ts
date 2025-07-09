import Toast from "react-native-toast-message";

export const editCompleteToast = () => {
  Toast.show({
    type: "success",
    text1: "예약 수정을 완료했어요!",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 2000,
  });
};
