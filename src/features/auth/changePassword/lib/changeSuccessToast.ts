import Toast from "react-native-toast-message";

export const changePasswordSuccessToast = () =>
  Toast.show({ type: "success", text1: "비밀번호가 변경되었습니다!" });

export const changePasswordErrorToast = () =>
  Toast.show({ type: "error", text1: "비밀번호 변경에 실패했습니다." });