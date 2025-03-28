import React from 'react'

import { LongButton } from '@hongpung/src/common'
import { useRecoilValue } from 'recoil'
import { reservationFormState } from '../../../model/reservationFormState'

export const CreateReservationButton: React.FC<{ isAble: boolean, onPress: () => void }> = ({ onPress }) => {

    const reservationForm = useRecoilValue(reservationFormState)

    return (
        <LongButton
            innerContent='예약하기'
            color='blue'
            isAble={Object.values(reservationForm).every(value => value !== null)}
            onPress={onPress}
        />
    )
    
}