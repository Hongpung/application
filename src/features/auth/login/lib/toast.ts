import Toast from "react-native-toast-message";

export const saveIDToast = () =>
  Toast.show({
    type: "success",
    text1: "아이디를 저장했어요",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });

export const setAutoLoginToast = () =>
  Toast.show({
    type: "success",
    text1: "앞으로 앱 실행시 자동으로 로그인 돼요",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });

export const signUpPendingToast = () =>
  Toast.show({
    type: "fail",
    text1: "가입이 진행중인 계정입니다\n(승낙시 확인 메일이 발송돼요)",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
