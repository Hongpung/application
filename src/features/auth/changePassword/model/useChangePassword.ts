import { useRef, useMemo } from "react";
import { ValidationState } from "@hongpung/src/common";
import { passwordSchema, type PasswordFormData } from "./passwordSchema";
import * as z from "zod";
import { useChangePasswordRequest } from "@hongpung/src/entities/auth";
import { TextInput } from "react-native";
import { useValidatedForm } from "@hongpung/src/common/lib/useValidatedForm";

export const useChangePasswordForm = (): {
  currentPassword: string;
  setCurrentPassword: (text: string) => void;
  newPassword: string;
  setNewPassword: (text: string) => void;
  confirmPassword: string;
  setConfirmPassword: (text: string) => void;
  onChangePassword: () => Promise<void>;
  passwordValidation: {
    currentPassword: ValidationState;
    newPassword: ValidationState;
    confirmPassword: ValidationState;
  };
  onCurrentPasswordBlur: () => void;
  onNewPasswordBlur: () => void;
  onConfirmPasswordBlur: () => void;
  currentPasswordRef: React.RefObject<TextInput | null>;
  newPasswordRef: React.RefObject<TextInput | null>;
  confirmPasswordRef: React.RefObject<TextInput | null>;
  isCanChangePassword: boolean;
} => {
  const { request: ChangePasswordRequest } = useChangePasswordRequest();

  const currentPasswordRef = useRef<TextInput | null>(null);
  const newPasswordRef = useRef<TextInput | null>(null);
  const confirmPasswordRef = useRef<TextInput | null>(null);

  const formDatas = useValidatedForm({
    schema: passwordSchema.innerType(),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    currentPassword,
    newPassword,
    confirmPassword,
    currentPasswordValidation,
    newPasswordValidation,
    confirmPasswordValidation,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    validateCurrentPassword,
    validateNewPassword,
    validateConfirmPassword,
  } = formDatas;

  const onBlur = useMemo(
    () => ({
      onCurrentPasswordBlur: () => {
        if (currentPasswordValidation.state !== "BEFORE") {
          validateCurrentPassword();
        }
      },
      onNewPasswordBlur: () => {
        if (newPasswordValidation.state !== "BEFORE") {
          validateNewPassword();
        }
      },
      onConfirmPasswordBlur: () => {
        if (confirmPasswordValidation.state !== "BEFORE") {
          validateConfirmPassword();
        }
      },
    }),
    [
      currentPasswordValidation,
      newPasswordValidation,
      confirmPasswordValidation,
      validateCurrentPassword,
      validateNewPassword,
      validateConfirmPassword,
    ],
  );

  const handleChangePassword = async () => {
    try {
      const formData: PasswordFormData = {
        currentPassword,
        newPassword,
        confirmPassword,
      };
      await passwordSchema.parseAsync(formData);
      await ChangePasswordRequest(formData);
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
    }
  };

  const isFormValid =
    currentPasswordValidation.state === "VALID" &&
    newPasswordValidation.state === "VALID" &&
    confirmPasswordValidation.state === "VALID";

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    onChangePassword: handleChangePassword,
    passwordValidation: {
      currentPassword: currentPasswordValidation,
      newPassword: newPasswordValidation,
      confirmPassword: confirmPasswordValidation,
    },
    ...onBlur,
    currentPasswordRef,
    newPasswordRef,
    confirmPasswordRef,
    isCanChangePassword: isFormValid,
  };
};
