import { useRef, useMemo } from "react";
import { ValidationState } from "@hongpung/src/common";
import { passwordSchema, type PasswordFormData } from "./changePasswordSchema";
import * as z from "zod";
import { useChangePasswordRequest } from "@hongpung/src/entities/auth";
import { TextInput } from "react-native";
import { FieldReturn, useValidatedForm } from "@hongpung/src/common/lib/useValidatedForm";
import { changePasswordErrorToast, changePasswordSuccessToast } from "../lib/changeSuccessToast";

export const useChangePasswordForm = (): {
  currentPasswordRef: React.RefObject<TextInput | null>;
  newPasswordRef: React.RefObject<TextInput | null>;
  confirmPasswordRef: React.RefObject<TextInput | null>;

  getField: (fieldName: keyof PasswordFormData) => FieldReturn<PasswordFormData[keyof PasswordFormData]>;

  onChangePassword: (
    {
      onSuccess,
      onError,
    }: {
      onSuccess?: () => void;
      onError?: () => void;
    }
  ) => Promise<void>;

  isCanChangePassword: boolean;
} => {
  const { request: ChangePasswordRequest } = useChangePasswordRequest();

  const currentPasswordRef = useRef<TextInput | null>(null);
  const newPasswordRef = useRef<TextInput | null>(null);
  const confirmPasswordRef = useRef<TextInput | null>(null);

  const {
    getField,
    getValues,
    validateAll,
    isFormValid
  } = useValidatedForm({
    schema: passwordSchema,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });


  const handleChangePassword = async ({
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    try {
      const validation = await validateAll();
      if (validation === false) throw new Error("비밀번호가 일치하지 않습니다.");
      const formData = getValues();
      await ChangePasswordRequest(formData);
      changePasswordSuccessToast();

      onSuccess?.();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors;
        errors.forEach((err) => {
          const field = err.path[0] as keyof PasswordFormData;
          if (field === "currentPassword") {
            currentPasswordRef.current?.focus();
          } else if (field === "newPassword") {
            newPasswordRef.current?.focus();
          } else if (field === "confirmPassword") {
            confirmPasswordRef.current?.focus();
          }
        });
      }
      console.log(error);
      changePasswordErrorToast();
      onError?.();
    }
  };

  return {
    getField,
    onChangePassword: handleChangePassword,
    currentPasswordRef,
    newPasswordRef,
    confirmPasswordRef,
    isCanChangePassword: isFormValid,
  };
};
