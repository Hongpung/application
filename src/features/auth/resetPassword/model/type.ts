import { TextInput } from "react-native";
import { FieldReturn } from "@hongpung/src/common";

import {
  EmailFormData,
  NewPasswordFormData,
  VerificationCodeFormData,
} from "./resetPasswordSchema";

export type ResetPasswordStep = "EmailConfirm" | "ResetPassword";

export type ResetPasswordStepFormProps<T extends ResetPasswordStep> =
  T extends "EmailConfirm"
    ? EmailValidateFormProps
    : T extends "ResetPassword"
      ? ResetPasswordFormProps
      : never;

export type ResetPasswordStepsProps = {
  [K in ResetPasswordStep]: ResetPasswordStepFormProps<K>;
};

export interface EmailValidateFormProps {
  emailRef: React.RefObject<TextInput|null>;
  verificationCodeRef: React.RefObject<TextInput|null>;

  getField: <T extends "email" | "verificationCode">(
    name: T
  ) => FieldReturn<(EmailFormData&VerificationCodeFormData)[T]>;

  isCanSendVerificationCode: boolean;

  sendVerificationCode: ({
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => Promise<void>;

  isSendVerificationCodePending: boolean;
  isSendCode: boolean;

  isCanVerifyCode: boolean;
  verifyCode: ({
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => Promise<void>;
  isVerifyingCodePending: boolean;
}

export interface ResetPasswordFormProps {
  newPasswordRef: React.RefObject<TextInput|null>;
  confirmPasswordRef: React.RefObject<TextInput|null>;

  getField: <T extends keyof NewPasswordFormData>(
    name: T
  ) => FieldReturn<NewPasswordFormData[T]>;

  isCanResetPassword: boolean;

  resetPassword: ({
    onSuccess,
    onError
  }: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => Promise<void>;
  isResetPasswordPending: boolean;
}
