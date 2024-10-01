import Toast from "react-native-toast-message";

export const showSignUpCompleteToast = () => {
    Toast.show({
        type: 'success',
        text1: '회원 가입 신청을 완료했어요!',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 2000
    });
};

export const showUncorrectCodeToast = () => {
    Toast.show({
        type: 'error',
        text1: '인증번호가 틀렸어요.',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 2000
    });
};

export const showExpiredCodeToast = () => {
    Toast.show({
        type: 'error',
        text1: '만료된 인증번호에요!',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 2000
    });
};

export const showEmailVirificationCompleteToast = () => {
    Toast.show({
        type: 'success',
        text1: '이메일이 인증됐어요!',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 2000
    });
};

export const showProblemToast = () => {
    Toast.show({
        type: 'error',
        text1: '문제가 발생했어요. 잠시후에 시도해주세요',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 2000
    });
};