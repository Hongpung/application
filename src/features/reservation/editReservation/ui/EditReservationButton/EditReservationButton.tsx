import React from 'react'

import { LongButton } from '@hongpung/src/common'
import { ReservationForm } from '../../../model/type'

import { useEditReservation } from '../../model/useEditReservation.context'

export const CreateReservationButton: React.FC = () => {

    const { verifyEditReservation } = useEditReservation()

    return (
        <LongButton
            innerContent='변경하기'
            color='blue'
            isAble={true}
            onPress={verifyEditReservation}
        />
    )

}