import Toast from "react-native-toast-message";

export const showEditInstrumentCompleteToast = () => {
  Toast.show({
    type: "success",
    text1: "악기 수정을 완료했어요!",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 2000,
  });
};
