import { FieldReturn } from "@hongpung/src/common";
import { TextInput } from "react-native";
import {
  EmailFormData,
  NewPasswordFormData,
  PersonalInfoFormData,
  VerificationCodeFormData,
} from "./signUpSchema";

export type SignUpStep = "EmailConfirm" | "SetPassword" | "PersonalInfo";

export type StepFormProps<T extends SignUpStep> = T extends "EmailConfirm"
  ? EmailValidateFormProps
  : T extends "SetPassword"
    ? SetPasswordFormProps
    : T extends "PersonalInfo"
      ? PersonalInfoFormProps
      : never;

export type SignUpStepPropsList = {
  [K in SignUpStep]: StepFormProps<K>;
};

export interface EmailValidateFormProps {
  emailRef: React.RefObject<TextInput | null>;
  verificationCodeRef: React.RefObject<TextInput | null>;

  getField: <T extends "email" | "verificationCode">(
    name: T
  ) => FieldReturn<(EmailFormData & VerificationCodeFormData)[T]>;

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

export interface SetPasswordFormProps {
  passwordRef: React.RefObject<TextInput | null>;
  confirmPasswordRef: React.RefObject<TextInput | null>;

  getField: (
    fieldName: keyof NewPasswordFormData
  ) => FieldReturn<NewPasswordFormData[keyof NewPasswordFormData]>;

  isCanSetPassword: boolean;

  validateNewPassword: ({
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => Promise<void>;
}

export interface PersonalInfoFormProps {
  nameRef: React.RefObject<TextInput | null>;
  nicknameRef: React.RefObject<TextInput | null>;
  enrollmentNumberRef: React.RefObject<TextInput | null>;

  getField: <T extends keyof PersonalInfoFormData>(
    fieldName: T
  ) => FieldReturn<PersonalInfoFormData[T]>;

  isClubOptionsVisible: boolean;
  setIsClubOptionsVisible: (visible: boolean) => void;

  isCanSignUp: boolean;

  signUp: ({
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => Promise<void>;

  isSignUpPending: boolean;
}
