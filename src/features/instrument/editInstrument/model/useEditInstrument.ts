import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Instrument } from "@hongpung/src/entities/instrument";
import { useEditInstrumentRequest } from "../api/editInstrumentApi";

import { Alert, useImagePicker, useValidatedForm } from "@hongpung/src/common";
import { showEditInstrumentCompleteToast } from "../constant/toastAction";
import { parseInstrumentEditBody } from "../lib/parseInstrumentEditBody";

import { instrumentEditFormSchema } from "./type";

export const useEditInstrument = ({
  initialInstrument,
}: {
  initialInstrument: Instrument;
}) => {
  const navigation = useNavigation();
  const {
    pickImageFromAlbum,
    selectedImage,
    selectedImageUri,
    resetImage,
    isResetImage,
  } = useImagePicker();
  const isInitialImage = useRef(true);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(
    initialInstrument.imageUrl ?? null,
  );

  const { getField, trigger, getValues } = useValidatedForm({
    schema: instrumentEditFormSchema,
    defaultValues: {
      instrumentId: initialInstrument.instrumentId,
      name: initialInstrument.name,
      instrumentType: initialInstrument.instrumentType,
      selectedImage: null,
      borrowAvailable: initialInstrument.borrowAvailable,
    },
  });

  const { request, isLoading } = useEditInstrumentRequest();

  useEffect(() => {
    getField("selectedImage").setValue(selectedImage);
    if (isInitialImage.current) {
      isInitialImage.current = false;
    } else {
      setSelectedImageUrl(selectedImageUri);
    }
  }, [selectedImage, getField, selectedImageUri]);

  const handleSubmit = async () => {
    try {
      const submitForm = await parseInstrumentEditBody(
        { ...getValues(), borrowAvailable: getField("borrowAvailable").value ?? false },
        isResetImage.current,
      );
      console.log("submitForm", submitForm);
      await request(submitForm);

      showEditInstrumentCompleteToast();
      navigation.goBack();
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

    pickImageFromAlbum,
    selectedImage,
    resetImage,
    selectedImageUrl,
    handleSubmit,
    isLoading,
  };
};
