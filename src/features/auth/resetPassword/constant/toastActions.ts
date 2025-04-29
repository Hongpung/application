import Toast from "react-native-toast-message";

export const showResetPasswordCompleteToast = () => {
  Toast.show({
    type: "success",
    text1: "비밀번호 재설정을 완료했어요!",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
};

export const showIncorrectCodeToast = () => {
  Toast.show({
    type: "error",
    text1: "인증번호가 틀렸어요.",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
};

export const showExpiredCodeToast = () => {
  Toast.show({
    type: "error",
    text1: "만료된 인증번호에요!",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
};

export const showEmailVirificationCompleteToast = () => {
  Toast.show({
    type: "success",
    text1: "이메일이 인증됐어요!",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
};

export const showProblemToast = (additionalText: string = "문제가 발생했어요. 잠시후에 시도해주세요") => {
  Toast.show({
    type: "error",
    text1: additionalText,
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
};
