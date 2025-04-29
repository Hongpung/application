import { ValidationState } from "@hongpung/src/common";
import { TextInput } from "react-native";

export type SignUpStep = "EmailConfirm" | "Password" | "PersonalInfo";

export type StepFormProps<T extends SignUpStep> = T extends "EmailConfirm"
  ? EmailValidateFormProps
  : T extends "Password"
  ? SetPasswordFormProps
  : T extends "PersonalInfo"
  ? PersonalInfoFormProps
  : never;

export interface EmailValidateFormProps {
  emailRef: React.RefObject<TextInput>;
  verificationCodeRef: React.RefObject<TextInput>;

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

  verifyCode: () => void;
  isVerifyingCodeLoading: boolean;
  isVerifyingCodeError: Error | null;
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
  validateName: (name: string) => void;
  validateNickname: (nickname: string) => void;
  validateClub: (club: ClubName) => void;
  validateEnrollmentNumber: (enrollmentNumber: string) => void;
  nameRef: React.RefObject<TextInput>;
  nicknameRef: React.RefObject<TextInput>;
  enrollmentNumberRef: React.RefObject<TextInput>;
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

  validateConfirmPassword: (text: string) => void;
  validatePassword: (text: string) => void;

  passwordRef: React.RefObject<TextInput>;
  confirmPasswordRef: React.RefObject<TextInput>;

  nextStep: () => void;
}
