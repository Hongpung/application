import Toast from "react-native-toast-message";

const extendSessionSuccessToast = () => {
    Toast.show({
        type: 'success',
        text1: '자동 로그인 설정이 완료되었어요',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 3000
    });
};

export { extendSessionSuccessToast }