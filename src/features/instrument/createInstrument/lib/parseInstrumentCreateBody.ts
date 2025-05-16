import { uploadImageRequest } from "@hongpung/src/common/api/uploadImageApi";
import { InstrumentCreateBody } from "../api/type";
import { InstrumentCreateForm } from "../model/type";

export const parseInstrumentCreateBody = async (instrumentCreateData: InstrumentCreateForm): Promise<InstrumentCreateBody> => {

    if (instrumentCreateData.instrumentType === null) { throw new Error('악기 종류를 선택해주세요.') }
    if (!!instrumentCreateData.selectedImage) {

        console.log('이미지 업로드 수행중')
        const uploadRespone = await uploadImageRequest(instrumentCreateData.selectedImage, 'instruments')

        if (!uploadRespone) throw Error('이미지 업로드 실패')

        console.log('이미지 업로드 수행완료')
        const { imageUrl } = uploadRespone;

        return {
            instrumentType: instrumentCreateData.instrumentType,
            name: instrumentCreateData.name,
            imageUrl
        }
    }
    else {
        return {
            instrumentType: instrumentCreateData.instrumentType,
            name: instrumentCreateData.name,
        }
    }
}