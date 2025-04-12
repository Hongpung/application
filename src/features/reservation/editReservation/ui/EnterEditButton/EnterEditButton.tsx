import React from 'react'

import { LongButton } from '@hongpung/src/common'
import { isEditible } from '@hongpung/src/entities/reservation/lib/isEditible'

interface EnterEditButtonProps {
    navigateToEditReservationPage: () => void
}

export const EnterEditButton: React.FC<EnterEditButtonProps> = ({ navigateToEditReservationPage }) => {


    return (
        <LongButton
            innerContent='수정하기'
            color='green'
            isAble={true}
            onPress={navigateToEditReservationPage}
        />
    )

}