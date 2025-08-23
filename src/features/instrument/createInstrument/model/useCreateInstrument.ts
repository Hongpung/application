import { useEffect } from "react";
import { Alert, useImagePicker, useValidatedForm } from "@hongpung/src/common";

import { parseInstrumentCreateBody } from "../lib/parseInstrumentCreateBody";
import { useCreateInsrumentRequest } from "../api/createInstrumentApi";
import { showCreateInstrumentCompleteToast } from "../constant/toastAction";

import { instrumentCreateFormSchema } from "./type";

export const useCreateInstrument = ({
  navigateToInstrumentDetail,
}: {
  navigateToInstrumentDetail: (instrumentId: number) => void;
}) => {
  const { pickImageFromAlbum, selectedImage, selectedImageUri, resetImage } =
    useImagePicker();

  const { getField, trigger, getValues } = useValidatedForm({
    schema: instrumentCreateFormSchema,
    defaultValues: {
      instrumentType: null,
      name: "",
      selectedImage: null,
    },
  });

  useEffect(() => {
    getField("selectedImage").setValue(selectedImage);
  }, [selectedImage, getField]);

  const { request, isLoading } = useCreateInsrumentRequest();

  const createInstrumentRequest = async () => {
    try {
      if (getField("instrumentType").validation.state === "ERROR") {
        Alert.alert("오류", "악기 종류를 선택해주세요.");
        return;
      }
      const submitForm = await parseInstrumentCreateBody(getValues());
      const response = await request(submitForm);

      const { instrumentId } = response;

      showCreateInstrumentCompleteToast();
      navigateToInstrumentDetail(instrumentId);
    } catch (err: unknown) {
      if (err instanceof Error) {
        Alert.alert("오류", "오류가 발생했어요.\n" + `(${err.message})`);
      } else {
        Alert.alert(
          "오류",
          "알수 없는 원인에 의해 실패했어요.\n관리자에게 문의해주세요",
        );
      }
    }
  };

  return {
    getField,
    trigger,
    getValues,

    createInstrumentRequest,
    pickImageFromAlbum,
    selectedImageUri,
    resetImage,
    isLoading,
  };
};
