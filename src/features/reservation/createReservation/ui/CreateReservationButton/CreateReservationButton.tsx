import React from 'react'

import { LongButton } from '@hongpung/src/common'
import { useCreateReservation } from '../../model/useCreateReservation.context'

export const CreateReservationButton: React.FC<{ isAble: boolean, onPress: () => void }> = ({ onPress }) => {

    const reservationForm = useCreateReservation();

    return (
        <LongButton
            innerContent='예약하기'
            color='blue'
            isAble={Object.values(reservationForm).every(value => value !== null)}
            onPress={onPress}
        />
    )
    
}