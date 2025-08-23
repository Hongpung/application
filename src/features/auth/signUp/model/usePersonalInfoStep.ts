import { useCallback, useEffect, useRef, useState } from "react";
import { TextInput } from "react-native";

import { useSignUpRequest } from "@hongpung/src/entities/auth";
import { PersonalInfoFormData, SignUpFormData } from "./signUpSchema";
import { FieldReturn } from "@hongpung/src/common";
import { clubNames } from "@hongpung/src/entities/club";
import { onSignUpSuccessToast } from "../lib/toast";

export const usePersonalInfoStep = ({
  getField,
  getValues,
  validateAll,
  isFormValid,
}: {
  getField: (fieldName: keyof PersonalInfoFormData) => FieldReturn<PersonalInfoFormData[keyof PersonalInfoFormData]>;
  getValues: () => SignUpFormData;
  validateAll: () => Promise<boolean>;
  isFormValid: boolean;
}) => {
  const nameRef = useRef<TextInput>(null);
  const nicknameRef = useRef<TextInput>(null);
  const enrollmentNumberRef = useRef<TextInput>(null);

  const [isClubOptionsVisible, setIsClubOptionsVisible] = useState(false);
  const { request: signUpRequest, isLoading: isSignUpPending } =
    useSignUpRequest();

  const signUp = useCallback(
    async ({
      onSuccess,
      onError,
    }: {
      onSuccess?: () => void;
      onError?: () => void;
    }) => {
      try {
        const validation = await validateAll();
        if (validation === false) return;
        const { email, password, name, club, enrollmentNumber, nickname } =
          getValues();
        await signUpRequest({
          email,
          password,
          name,
          clubId: club ? clubNames.indexOf(club as ClubName) : null,
          enrollmentNumber,
          nickname,
        });
        onSignUpSuccessToast();
        onSuccess?.();
      } catch (error) {
        onError?.();
        console.log(error);
        throw error;
      }
    },
    [validateAll, signUpRequest, getValues]
  );

  const closeClubOptions = useCallback(() => {
    getField("club").onBlur?.();
    setIsClubOptionsVisible(false);
  }, [getField]);

  return {
    nameRef,
    nicknameRef,
    enrollmentNumberRef,

    getField,

    isClubOptionsVisible,
    setIsClubOptionsVisible,

    isCanSignUp: isFormValid,

    signUp,
    isSignUpPending,

    dissmissClubOptions: closeClubOptions,
  };
};
