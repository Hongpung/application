import { useCallback, useMemo, useRef } from "react";
import { TextInput } from "react-native";

import * as z from "zod";

import { type ValidationState, useValidatedForm } from "@hongpung/src/common";
import { useIsRegisteredEmailRequest } from "@hongpung/src/entities/auth";

import { resetPasswordSchema } from "./resetPasswordSchema";

export const useResetPasswordForm = (): {
  email: string;
  setEmail: (text: string) => void;
  newPassword: string;
  setNewPassword: (text: string) => void;
  confirmPassword: string;
  setConfirmPassword: (text: string) => void;
  validateEmail: () => Promise<void>;
  validateNewPassword: () => void;
  validateConfirmPassword: () => void;

  emailValidation: ValidationState;
  newPasswordValidation: ValidationState;
  confirmPasswordValidation: ValidationState;

  setEmailValidation: (validation: ValidationState) => void;
  setNewPasswordValidation: (validation: ValidationState) => void;
  setConfirmPasswordValidation: (validation: ValidationState) => void;

  onEmailBlur: () => void;
  onNewPasswordBlur: () => void;
  onConfirmPasswordBlur: () => void;
  emailRef: React.RefObject<TextInput | null>;
  newPasswordRef: React.RefObject<TextInput | null>;
  confirmPasswordRef: React.RefObject<TextInput | null>;
  isCanResetPassword: boolean;
} => {
  const { request: isRegisteredEmail } = useIsRegisteredEmailRequest();

  const emailRef = useRef<TextInput | null>(null);
  const newPasswordRef = useRef<TextInput | null>(null);
  const confirmPasswordRef = useRef<TextInput | null>(null);

  const formDatas = useValidatedForm({
    schema: resetPasswordSchema,
    defaultValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    email,
    newPassword,
    confirmPassword,
    emailValidation,
    newPasswordValidation,
    confirmPasswordValidation,
    setEmail,
    setNewPassword,
    setConfirmPassword,
    validateNewPassword,
    validateConfirmPassword,
    setEmailValidation,
    setConfirmPasswordValidation,
    setNewPasswordValidation,
  } = formDatas;

  const validateEmail = useCallback(async () => {
    try {
      await resetPasswordSchema.innerType().shape.email.parseAsync(email);
      const { isRegistered } = await isRegisteredEmail({ email });
      if (isRegistered === false) {
        setEmailValidation({
          state: "ERROR",
          errorText: "존재하지 않는 이메일입니다.",
        });
        return;
      }
      setEmailValidation({ state: "VALID" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailValidation({
          state: "ERROR",
          errorText: error.errors[0].message,
        });
      }
    }
  }, [email, isRegisteredEmail, setEmailValidation]);

  const onBlur = useMemo(
    () => ({
      onEmailBlur: () => {
        if (emailValidation.state !== "BEFORE") {
          validateEmail();
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
      emailValidation.state,
      newPasswordValidation.state,
      confirmPasswordValidation.state,
      validateEmail,
      validateNewPassword,
      validateConfirmPassword,
    ],
  );

  const isFormValid =
    emailValidation.state === "VALID" &&
    newPasswordValidation.state === "VALID" &&
    confirmPasswordValidation.state === "VALID";

  return {
    email,
    newPassword,
    confirmPassword,
    setEmail,
    setNewPassword,
    setConfirmPassword,
    validateEmail,
    validateNewPassword,
    validateConfirmPassword,
    setEmailValidation,
    setNewPasswordValidation,
    setConfirmPasswordValidation,
    emailValidation,
    newPasswordValidation,
    confirmPasswordValidation,
    ...onBlur,
    emailRef,
    newPasswordRef,
    confirmPasswordRef,
    isCanResetPassword: isFormValid,
  };
};
