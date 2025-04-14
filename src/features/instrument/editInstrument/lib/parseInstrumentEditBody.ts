import { InstrumentEditBody } from '../api/type'
import { Instrument } from '@hongpung/src/entities/instrument'
import uploadImage from '@hongpung/legacy/utils/uploadImage'

interface ParseInstrumentEditBodyParams {
    instrument: Instrument
    selectedImage: File | null
}

export const parseInstrumentEditBody = async ({ instrument, selectedImage }: ParseInstrumentEditBodyParams): Promise<InstrumentEditBody> => {
    
    const submitForm: InstrumentEditBody = {
        instrumentId: instrument.instrumentId,
        name: instrument.name,
        instrumentType: instrument.instrumentType,
        borrowAvailable: instrument.borrowAvailable,
        imageUrl: instrument.imageUrl
    }

    if (selectedImage) {
        const uploadResponse = await uploadImage(selectedImage, 'instruments')
        if (!uploadResponse) throw Error('업로드 실패')
        submitForm.imageUrl = uploadResponse.imageUrl
    }

    return submitForm
} 