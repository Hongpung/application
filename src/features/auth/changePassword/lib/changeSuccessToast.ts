import Toast from "react-native-toast-message";

export const changePasswordSuccessToast = () => Toast.show({ type: "success", text1: "비밀번호가 변경되었습니다!" });