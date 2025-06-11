import Toast from "react-native-toast-message";

export const changeProfileSuccessToast = () =>
  Toast.show({ type: "success", text1: "정보가 변경되었습니다!" });
