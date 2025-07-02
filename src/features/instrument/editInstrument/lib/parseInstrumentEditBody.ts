import { InstrumentEditBody } from "../api/type";
import { uploadImageRequest } from "@hongpung/src/common/api/uploadImageApi";
import { InstrumentEditForm } from "../model/type";

export const parseInstrumentEditBody = async (
  form: InstrumentEditForm,
  isResetImage: boolean,
): Promise<InstrumentEditBody> => {
  const { selectedImage, instrumentId, name, instrumentType, borrowAvailable } =
    form;

  const submitBody: InstrumentEditBody = {
    instrumentId,
    name,
    instrumentType,
    borrowAvailable,
    imageUrl: undefined,
  };

  if (selectedImage === null) {
    // 이미지 삭제
    if (isResetImage) {
      submitBody.imageUrl = null;
      return submitBody;
    }
    // 이미지 변경 안함
    return submitBody;
  }

  //이미지 변경 및 전송
  const uploadResponse = await uploadImageRequest(selectedImage, "instruments");
  if (!uploadResponse) throw Error("업로드 실패");
  submitBody.imageUrl = uploadResponse.imageUrl;

  return submitBody;
};
