import Toast from "react-native-toast-message";

export const showCreateInstrumentCompleteToast = () => {
    Toast.show({
        type: 'success',
        text1: '악기 등록을 완료했어요!',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 2000
    });
};
