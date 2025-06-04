import { ValidationState } from "@hongpung/src/common";

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
  email: string;
  setEmail: (email: string) => void;
  emailValidation: ValidationState;
  validateEmail: (email: string) => void;

  //이메일 인증 코드 발송
  isSendingCode: boolean;
  isSendingCodeError: Error | null;

  sendVerificationCode: () => void;
  isSendingCodeLoading: boolean;

  verificationCode: string;
  verificationCodeValidation: ValidationState;
  setVerificationCode: (code: string) => void;
  validateVerificationCode: (code: string) => void;

  onVerifyCode: ({ onSuccess }: { onSuccess: () => void }) => void;
  isVerifyingCodeLoading: boolean;
  isVerifyingCodeError: Error | null;
}

export interface ResetPasswordFormProps {
  newPassword?: string;
  setNewPassword: (text: string) => void;
  confirmPassword?: string;
  setConfirmPassword: (text: string) => void;

  newPasswordValidation: ValidationState;
  confirmPasswordValidation: ValidationState;

  validateConfirmPassword: (text: string) => void;
  validateNewPassword: (text: string) => void;

  resetPassword: () => void;
}
