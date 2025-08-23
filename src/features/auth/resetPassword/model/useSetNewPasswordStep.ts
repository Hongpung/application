import { useCallback, useRef } from "react";
import { TextInput } from "react-native";

import { deleteToken, useValidatedForm } from "@hongpung/src/common";

import { newPasswordSchema } from "./resetPasswordSchema";
import { useResetPasswordRequest } from "@hongpung/src/entities/auth";
import { getToken } from "@hongpung/src/common";

export const useSetNewPasswordStep = ({ email }: { email?: string }) => {
  const { request: resetPasswordRequest, isLoading: isResetPasswordPending } =
    useResetPasswordRequest();

  const newPasswordRef = useRef<TextInput | null>(null);
  const confirmPasswordRef = useRef<TextInput | null>(null);

  const { getField, getValues, validateAll, isFormValid } =
    useValidatedForm({
      schema: newPasswordSchema,
      defaultValues: {
        newPassword: "",
        confirmPassword: "",
      },
    });

  const resetPassword = useCallback(
    async ({
      onSuccess,
      onError,
    }: {
      onSuccess?: () => void;
      onError?: () => void;
    }) => {
      try {
        if (!email) throw new Error("이메일이 없습니다.");
        const validation = await validateAll();
        if (validation === false) return;

        const newPassword = getValues("newPassword");

        const tempToken = await getToken("temp-token");
        if (!tempToken) throw new Error("토큰이 없습니다.");
        await resetPasswordRequest({ newPassword, email, tempToken });
        onSuccess?.();
        await deleteToken("temp-token");

      } catch (error) {
        onError?.();
        throw error;
      }
    },
    [email, getValues, resetPasswordRequest, validateAll]
  );

  return {
    newPasswordRef,
    confirmPasswordRef,

    getField,
    
    isCanResetPassword: isFormValid,
    
    resetPassword,
    isResetPasswordPending,

  };
};
