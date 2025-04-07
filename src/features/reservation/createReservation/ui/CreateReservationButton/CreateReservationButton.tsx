import React from 'react'

import { LongButton } from '@hongpung/src/common'
import { useCreateReservation } from '../../model/useCreateReservation.context'

export const CreateReservationButton: React.FC<{ isAgree: boolean, onPress: () => void }> = ({ isAgree, onPress }) => {

    const { isValidReservation } = useCreateReservation();

    return (
        <LongButton
            innerContent='예약하기'
            color='blue'
            isAble={isAgree && isValidReservation}
            onPress={onPress}
        />
    )

}