import React from 'react'

import { LongButton } from '@hongpung/src/common'
import { useRecoilValue } from 'recoil'
import { reservationFormState } from '../../../model/reservationFormSelector'
import { ReservationForm } from '../../../model/type'

import { isEqual } from 'lodash'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export const CreateReservationButton: React.FC<{ preReservation: ReservationForm }> = ({ preReservation }) => {

    const navigation = useNavigation();
    const reservationForm = useRecoilValue(reservationFormState)

    return (
        <LongButton
            innerContent='변경하기'
            color='blue'
            isAble={true}
            onPress={() => {
                if (isEqual(preReservation, reservationForm)) {
                    Alert.alert(
                        '예약 오류', // 타이틀
                        "기존 예약과 동일합니다.", // 내용
                        [
                            {
                                text: '확인', // 두 번째 버튼 (확인)
                            },
                        ],
                    );
                } else {
                    // navigation.navigate('ReservationEditConfirm')
                }
            }}
        />
    )

}