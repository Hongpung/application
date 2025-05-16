import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Instrument } from '@hongpung/src/entities/instrument'
import { useEditInstrumentRequest } from '../api/editInstrumentApi'

import { Alert } from '@hongpung/src/common'
import { showEditInstrumentCompleteToast } from '../constant/toastAction'
import { parseInstrumentEditBody } from '../lib/parseInstrumentEditBody'

export const useEditInstrument = ({ initialInstrument, selectedFile }: { initialInstrument: Instrument, selectedFile: File | null }) => {
    const navigation = useNavigation()

    const [instrument, setInstrument] = useState<Instrument>(initialInstrument)

    const { request, isLoading } = useEditInstrumentRequest()

    const handleNameChange = (name: string) => {
        setInstrument(prev => ({ ...prev, name }))
    }

    const handleSubmit = async () => {
        try {
            const submitForm = await parseInstrumentEditBody({
                instrument,
                selectedImage: selectedFile
            });
            await request(submitForm);
            showEditInstrumentCompleteToast();
            navigation.goBack();
        } catch (err: unknown) {
            if (err instanceof Error) {
                Alert.alert('오류', '오류가 발생했어요.\n' + `(${err.message})`)
            } else {
                Alert.alert('오류', '알수 없는 원인에 의해 실패했어요.\n관리자에게 문의해주세요')
            }
        }
    }

    return {
        instrument,
        setInstrument,
        handleNameChange,
        handleSubmit,
        isLoading
    }
} 