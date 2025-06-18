import Toast from "react-native-toast-message";

export const onSignUpSuccessToast = () => {
  Toast.show({
    type: "success",
    text1:
      "회원가입 신청이 완료됐어요!\n회원가입이 수락되면 이메일로 알려줄게요.",
    position: "bottom",
    bottomOffset: 60,
    visibilityTime: 3000,
  });
};
