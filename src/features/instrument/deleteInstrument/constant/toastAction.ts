import Toast from 'react-native-toast-message'

export const showDeleteInstrumentCompleteToast = () => {
    Toast.show({
        type: 'success',
        text1: '악기 삭제를 완료했어요!',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 2000
    })
} 