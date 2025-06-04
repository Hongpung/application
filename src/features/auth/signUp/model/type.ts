import { ValidationState } from "@hongpung/src/common";
import { TextInput } from "react-native";

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

  email: string;
  setEmail: (email: string) => void;
  emailValidation: ValidationState;
  validateEmail: () => void;

  //이메일 인증 코드 발송
  isSendingCode: boolean;

  sendVerificationCode: () => void;
  isSendingCodeLoading: boolean;

  verificationCode: string;
  verificationCodeValidation: ValidationState;
  setVerificationCode: (code: string) => void;
  validateVerificationCode: (code: string) => void;

  verifyCode: ({ onSuccess }: { onSuccess: () => void }) => void;
  isVerifyingCodeLoading: boolean;
}

export interface PersonalInfoFormProps {
  name: string;
  nickname?: string;
  club: ClubName | null;
  enrollmentNumber: string;
  setName: (name: string) => void;
  setNickname: (nickname: string) => void;
  setClub: (club: ClubName) => void;
  setEnrollmentNumber: (enrollmentNumber: string) => void;
  nameValidation: ValidationState;
  nicknameValidation: ValidationState;
  clubValidation: ValidationState;
  enrollmentNumberValidation: ValidationState;
  validateName: () => void;
  validateNickname: () => void;
  validateClub: () => void;
  validateEnrollmentNumber: () => void;
  nameRef: React.RefObject<TextInput | null>;
  nicknameRef: React.RefObject<TextInput | null>;
  enrollmentNumberRef: React.RefObject<TextInput | null>;
  isClubOptionsVisible: boolean;
  setIsClubOptionsVisible: (visible: boolean) => void;
  isSignUpError: Error | null;
  isSignUpLoading: boolean;
  signUp: () => void;
}

export interface SetPasswordFormProps {
  password?: string;
  setPassword: (text: string) => void;
  confirmPassword?: string;
  setConfirmPassword: (text: string) => void;

  passwordValidation: ValidationState;
  confirmPasswordValidation: ValidationState;

  validateConfirmPassword: () => void;
  validatePassword: () => void;

  passwordRef: React.RefObject<TextInput | null>;
  confirmPasswordRef: React.RefObject<TextInput | null>;
}
