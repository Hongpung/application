import React from 'react'
import { Alert } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { LongButton } from '@hongpung/src/common'

import { isEditible, useDeleteReservationRequest } from '@hongpung/src/entities/reservation'

interface DeleteReservationButtonProps {
    reservationId: number
    date: string
}

export const DeleteReservationButton: React.FC<DeleteReservationButtonProps> = ({ date, reservationId }) => {

    const navigation = useNavigation();
    const { request, isLoading, error } = useDeleteReservationRequest()

    const onButtonPressed = async () => {

        if (!isEditible(date)) {
            Alert.alert('오류', '취소 가능한 시간이 아닙니다.');
            return;
        }

        Alert.alert(
            '확인',
            '정말 취소하시겠습니까?',
            [
                { text: '아니오', style: 'cancel' },
                {
                    text: '예',
                    onPress: async () => {
                        try {
                            await request({ reservationId });
                            navigation.goBack();
                        } catch {
                            Alert.alert('오류', '오류가 발생했습니다.');
                        }
                    },
                },
            ],
            { cancelable: true }
        );

    };

    return (
        <LongButton
            innerContent='취소하기'
            color='red'
            isAble={true}
            onPress={onButtonPressed}
        />
    )

}