import React from 'react'

import { LongButton } from '@hongpung/src/common'

interface ParticipatorsConfirmButtonProps {
    participatorsLength: number;
    onPress: () => void
}

export const ParticipatorsConfirmButton: React.FC<ParticipatorsConfirmButtonProps> = ({ participatorsLength, onPress }) => {

    return (
        <LongButton
            innerContent={`선택완료 (${participatorsLength} 명)`}
            color='blue'
            isAble={true}
            onPress={onPress}
        />
    )

}

{/* <LongButton
                        color='blue'
                        isAble={true}
                        innerText={`선택완료 (${reservation.borrowInstruments.length})`}
                        onPress={() => navigation.goBack()}
                    /> */}