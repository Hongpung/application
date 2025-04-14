import React from 'react'
import { LongButton } from '@hongpung/src/common'

interface DeleteInstrumentButtonProps {
    onPress: () => void
}

export const DeleteInstrumentButton: React.FC<DeleteInstrumentButtonProps> = ({ onPress }) => {
    return (
        <LongButton
            innerContent='삭제하기'
            color='red'
            isAble={true}
            onPress={onPress}
        />
    )
}
