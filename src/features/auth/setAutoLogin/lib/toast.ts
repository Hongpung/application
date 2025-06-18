import Toast from "react-native-toast-message";

const turnOnAutoLoginSuccessToast = () => {
  Toast.show({
    type: "success",
    text1: "자동 로그인 설정이 완료되었어요",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
};
const turnOffAutoLoginSuccessToast = () => {
  Toast.show({
    type: "success",
    text1: "자동 로그인 해제가 완료되었어요",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
};

const turnOnAutoLoginFailedToast = () => {
  Toast.show({
    type: "error",
    text1: "자동 로그인 설정에 실패했어요\n 다시 시도해주세요",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
};
const turnOffAutoLoginFailedToast = () => {
  Toast.show({
    type: "error",
    text1: "자동 로그인 해제 실패했어요\n 다시 시도해주세요",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
};

export {
  turnOnAutoLoginSuccessToast,
  turnOffAutoLoginSuccessToast,
  turnOnAutoLoginFailedToast,
  turnOffAutoLoginFailedToast,
};
