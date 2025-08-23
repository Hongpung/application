import { useCallback, useMemo, useRef } from "react";

import { NewPasswordFormData } from "./signUpSchema";
import { FieldReturn } from "@hongpung/src/common/lib/useValidatedForm";
import { TextInput } from "react-native";

export const useSetNewPasswordStep = ({
  getField,
  validateAll,
}: {
  getField: (
    fieldName: keyof NewPasswordFormData
  ) => FieldReturn<NewPasswordFormData[keyof NewPasswordFormData]>;
  validateAll: () => Promise<boolean>;
}) => {
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const validateNewPassword = useCallback(
    async ({
      onSuccess,
      onError,
    }: {
      onSuccess?: () => void;
      onError?: () => void;
    }) => {
      try {
        const validation = await validateAll();
        if (validation === false)
          throw new Error("비밀번호가 일치하지 않습니다.");
        onSuccess?.();
      } catch (error) {
        onError?.();
        throw error;
      }
    },
    [validateAll]
  );

  const isCanSetPassword = useMemo(
    () =>
      getField("password").validation.state === "VALID" &&
      getField("confirmPassword").validation.state === "VALID",
    [getField]
  );

  return {
    passwordRef,
    confirmPasswordRef,

    getField,

    isCanSetPassword,

    validateNewPassword,
  };
};
