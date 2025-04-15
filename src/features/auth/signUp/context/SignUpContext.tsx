import { createContext, useContext, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  useIsDuplicatedEmailRequest,
  useSignUpRequest,
  useSendVerificationCodeRequest,
  useVerifyCodeRequest,
} from "../api/signUpApi";
import { ValidationState } from "@hongpung/src/common";
import { signUpSchema, type SignUpFormData } from "../model/signUpSchema";
import * as z from "zod";

type SignUpSteps = "EmailConfirm" | "Password" | "PersonalInfo";

interface SignUpContextType {
  step: SignUpSteps;
  formData: SignUpFormData;
  formValidation: {
    [key in keyof SignUpFormData]: ValidationState;
  };
  nextStep: () => void;
  prevStep: () => void;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setName: (name: string) => void;
  setNickname: (nickname: string) => void;
  setClubId: (clubId: number | null) => void;
  setEnrollmentNumber: (enrollmentNumber: string) => void;
  validateEmail: (email: string) => Promise<void>;
  validatePassword: (password: string) => void;
  validateConfirmPassword: (confirmPassword: string) => void;
  validateName: (name: string) => void;
  validateNickname: (nickname: string) => void;
  validateEnrollmentNumber: (enrollmentNumber: string) => void;
  isCanNextStep: boolean;
  isLoading: boolean;
  isDuplicatedEmailLoading: boolean;
  verificationCode: string;
  isEmailVerified: boolean;
  isSendingCode: boolean;
  isVerifyingCode: boolean;
  setVerificationCode: (code: string) => void;
  sendVerificationCode: () => Promise<void>;
  verifyCode: () => Promise<void>;
}

const SignUpContext = createContext<SignUpContextType | null>(null);

export const SignUpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigation = useNavigation();
  const [step, setStep] = useState<SignUpSteps>("EmailConfirm");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    nickname: undefined,
    clubId: null,
    enrollmentNumber: 0,
  });

  const [formValidation, setFormValidation] = useState<{
    [key in keyof SignUpFormData]: ValidationState;
  }>({
    email: { state: "BEFORE" },
    password: { state: "BEFORE" },
    confirmPassword: { state: "BEFORE" },
    name: { state: "BEFORE" },
    nickname: { state: "VALID" },
    clubId: { state: "BEFORE" },
    enrollmentNumber: { state: "BEFORE" },
  });

  const { request: signUp, isLoading } = useSignUpRequest();
  const { request: isDuplicatedEmail, isLoading: isDuplicatedEmailLoading } =
    useIsDuplicatedEmailRequest();
  const { request: sendVerificationCode, isLoading: isSendingCode } = useSendVerificationCodeRequest();
  const { request: verifyCode, isLoading: isVerifyingCode } = useVerifyCodeRequest();

  const nextStep = () => {
    setStep((prev) => {
      if (prev === "EmailConfirm") return "Password";
      if (prev === "Password") return "PersonalInfo";
      return prev;
    });
  };

  const prevStep = () => {
    setStep((prev) => {
      if (prev === "PersonalInfo") return "Password";
      if (prev === "Password") return "EmailConfirm";
      return prev;
    });
  };

  const onClose = () => {
    if (confirm("회원가입을 취소하시겠습니까?")) {
      navigation.goBack();
    }
  };

  const setForm = useMemo(() => ({
    setEmail: (email: string) => {
      setFormValidation((prev) => ({
        ...prev,
        email: { state: "PENDING" },
      }));
      setFormData((prev) => ({ ...prev, email }));
    },
    setPassword: (password: string) => {
      setFormValidation((prev) => ({
        ...prev,
        password: { state: "PENDING" },
      }));
      setFormData((prev) => ({ ...prev, password }));
    },
    setConfirmPassword: (confirmPassword: string) => {
      setFormValidation((prev) => ({
        ...prev,
        confirmPassword: { state: "PENDING" },
      }));
      setFormData((prev) => ({ ...prev, confirmPassword }));
    },
    setName: (name: string) => {
      setFormValidation((prev) => ({
        ...prev,
        name: { state: "PENDING" },
      }));
      setFormData((prev) => ({ ...prev, name }));
    },
    setNickname: (nickname: string) => {
      setFormValidation((prev) => ({
        ...prev,
        nickname: { state: "PENDING" },
      }));
      setFormData((prev) => ({ ...prev, nickname }));
    },
    setClubId: (clubId: number | null) => {
      setFormValidation((prev) => ({
        ...prev,
        clubId: { state: "PENDING" },
      }));
      setFormData((prev) => ({ ...prev, clubId }));
    },
    setEnrollmentNumber: (enrollmentNumber: string) => {
      setFormValidation((prev) => ({
        ...prev,
        enrollmentNumber: { state: "PENDING" },
      }));
      setFormData((prev) => ({ ...prev, enrollmentNumber: Number(enrollmentNumber) }));
    },
  }), [setFormValidation, setFormData]);

  const validateForm = useMemo(() => ({
    validateEmail: async (email: string) => {
      try {
        await signUpSchema.innerType().shape.email.parseAsync(email);
        const response = await isDuplicatedEmail({ email });
        if (response.isRegistered) {
          setFormValidation((prev) => ({
            ...prev,
            email: { state: "ERROR", errorText: "이미 사용중인 이메일입니다." },
          }));
          return;
        }
        setFormValidation((prev) => ({
          ...prev,
          email: { state: "VALID" },
        }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setFormValidation((prev) => ({
            ...prev,
            email: { state: "ERROR", errorText: error.errors[0].message },
          }));
        }
      }
    },
    validatePassword: (password: string) => {
      try {
        signUpSchema.innerType().shape.password.parse(password);
        setFormValidation((prev) => ({
          ...prev,
          password: { state: "VALID" },
        }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setFormValidation((prev) => ({
            ...prev,
            password: { state: "ERROR", errorText: error.errors[0].message },
          }));
        }
      }
    },
    validateConfirmPassword: (confirmPassword: string) => {
      try {
        signUpSchema.innerType().shape.confirmPassword.parse(confirmPassword);
        if (confirmPassword !== formData.password) {
          setFormValidation((prev) => ({
            ...prev,
            confirmPassword: {
              state: "ERROR",
              errorText: "비밀번호가 일치하지 않습니다.",
            },
          }));
          return;
        }
        setFormValidation((prev) => ({
          ...prev,
          confirmPassword: { state: "VALID" },
        }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setFormValidation((prev) => ({
            ...prev,
            confirmPassword: { state: "ERROR", errorText: error.errors[0].message },
          }));
        }
      }
    },
    validateName: (name: string) => {
      try {
        signUpSchema.innerType().shape.name.parse(name);
        setFormValidation((prev) => ({
          ...prev,
          name: { state: "VALID" },
        }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setFormValidation((prev) => ({
            ...prev,
            name: { state: "ERROR", errorText: error.errors[0].message },
          }));
        }
      }
    },
    validateNickname: (nickname: string) => {
      try {
        signUpSchema.innerType().shape.nickname.parse(nickname);
        setFormValidation((prev) => ({
          ...prev,
          nickname: { state: "VALID" },
        }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setFormValidation((prev) => ({
            ...prev,
            nickname: { state: "ERROR", errorText: error.errors[0].message },
          }));
        }
      }
    },
    validateEnrollmentNumber: (enrollmentNumber: string) => {
      try {
        signUpSchema.innerType().shape.enrollmentNumber.parse(enrollmentNumber);
        setFormValidation((prev) => ({
          ...prev,
          enrollmentNumber: { state: "VALID" },
        }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setFormValidation((prev) => ({
            ...prev,
            enrollmentNumber: { state: "ERROR", errorText: error.errors[0].message },
          }));
        }
      }
    },
  }), [formData, setFormValidation]);

  const emailVerification = useMemo(() => ({
    sendVerificationCode: async () => {
      if (formValidation.email.state !== "VALID") {
        return;
      }
      try {
        await sendVerificationCode({ email: formData.email });
      } catch (error) {
        console.error("인증번호 발송 실패:", error);
      }
    },
    verifyCode: async () => {
      try {
        const response = await verifyCode({
          email: formData.email,
          code: verificationCode,
        });
        if (response.isVerified) {
          setIsEmailVerified(true);
        }
      } catch (error) {
        console.error("인증번호 검증 실패:", error);
      }
    },
  }), [formData.email, formValidation.email.state, verificationCode]);

  const isCanNextStep = useMemo(() => {
    if (step === "EmailConfirm") {
      return formValidation.email.state === "VALID" && isEmailVerified;
    }
    if (step === "Password") {
      return (
        formValidation.email.state === "VALID" &&
        formValidation.password.state === "VALID" &&
        formValidation.confirmPassword.state === "VALID"
      );
    }
    if (step === "PersonalInfo") {
      return (
        formValidation.email.state === "VALID" &&
        formValidation.password.state === "VALID" &&
        formValidation.confirmPassword.state === "VALID" &&
        formValidation.name.state === "VALID" &&
        formValidation.enrollmentNumber.state === "VALID"
      );
    }
    return false;
  }, [step, formValidation, isEmailVerified]);

  const onSubmit = async () => {
    if (step === "PersonalInfo") {
      try {
        await signUpSchema.parseAsync(formData);
        signUp({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          nickname: formData.nickname,
          clubId: formData.clubId,
          enrollmentNumber: formData.enrollmentNumber.toString(),
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("폼 검증 실패:", error.errors);
        }
      }
    } else {
      nextStep();
    }
  };

  const value = {
    step,
    formData,
    formValidation,
    nextStep,
    prevStep,
    onClose,
    onSubmit,
    ...setForm,
    ...validateForm,
    isCanNextStep,
    isLoading,
    isDuplicatedEmailLoading,
    verificationCode,
    isEmailVerified,
    isSendingCode,
    isVerifyingCode,
    setVerificationCode,
    ...emailVerification,
  };

  return (
    <SignUpContext.Provider value={value}>
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = () => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("useSignUp must be used within SignUpProvider");
  }
  return context;
}; 