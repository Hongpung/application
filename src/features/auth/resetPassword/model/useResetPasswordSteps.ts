import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  useSendResetPasswordVerificationCodeRequest as useSendVerificationCodeRequest,
  useVerifyResetPasswordVerificationCodeRequest as useVerifyCodeRequest,
  useResetPasswordRequest,
  useIsRegisteredEmailRequest,
} from "@hongpung/src/entities/auth";
import { Alert, deleteToken, getToken, ValidationState } from "@hongpung/src/common";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "./resetPaswordSchema";
import * as z from "zod";
import {  BackHandler, TextInput } from "react-native";
import { ResetPasswordStep } from "./type";
import {
  showEmailVirificationCompleteToast,
  showProblemToast,
  showResetPasswordCompleteToast,
} from "../constant/toastActions";
import useVerificationCodeFlow from "./useVerificationCodeFlow";
import useResetPasswordForm from "./useResetPasswordForm";

const useResetPasswordSteps = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState<ResetPasswordStep>("EmailConfirm");
  const [isSendingCode, setIsSendingCode] = useState(false);

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
    validateEmail,
    validateNewPassword,
    validateConfirmPassword,
    setFormValidation,
  } = useResetPasswordForm();

  const {
    verificationCode,
    setVerificationCode,
    verificationCodeValidation,
    verifyCode,
    validateVerificationCode,
    isVerifyingCodeLoading,
    isVerifyingCodeError,
  } = useVerificationCodeFlow(email);


  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true; // true를 리턴하면 뒤로가기가 막힘
      }
    );

    return () => {
      // 컴포넌트 unmount 시 이벤트 제거
      backHandler.remove();
    };
  }, []);

  
  const {
    request: resetPassword,
    isLoading: isResetPasswordLoading,
    error: isResetPasswordError,
  } = useResetPasswordRequest();
  const {
    request: sendVerificationCode,
    isLoading: isSendingCodeLoading,
    error: isSendingCodeError,
  } = useSendVerificationCodeRequest();

  const nextStep = () => {
    setStep((prev) => {
      if (prev === "EmailConfirm") return "ResetPassword";
      return prev;
    });
  };

  const prevStep = () => {
    setStep((prev) => {
      if (prev === "ResetPassword") return "EmailConfirm";
      return prev;
    });
  };

  const onClose = () => {
      Alert.confirm(
        "확인",
        "비밀번호 재설정을 취소하고 뒤로 돌아갈까요?",
        {
          cancelText: "아니오",
          confirmText: "네",
          confirmButtonColor:"green",
          cancelButtonColor:"green",
          onConfirm: () => {
            navigation.goBack();
          },
        }
      );
    };

  

  const isCanNextStep = useMemo(() => {
    if (step === "EmailConfirm") {
      return (
        emailValidation.state === "VALID" &&
        verificationCodeValidation.state === "VALID"
      );
    }
    if (step === "ResetPassword") {
      return (
        emailValidation.state === "VALID" &&
        newPasswordValidation.state === "VALID" &&
        confirmPasswordValidation.state === "VALID"
      );
    }
    return false;
  }, [step, emailValidation, verificationCodeValidation]);

  const onPressSendVerificationCode = async () => {
    if (email) {
      const isEmailValid = await validateEmail(email);
      if (isEmailValid === false) {
        return;
      }
      try {
        await sendVerificationCode({
          email: email,
        });
        setIsSendingCode(true);
      } catch {
        setIsSendingCode(false);
      }
      setIsSendingCode(true);
    } else {
      setFormValidation((prev) => ({
        ...prev,
        email: {
          state: "ERROR",
          errorText: "이메일을 입력해주세요.",
        },
      }));
    }
  };

  const onVerifyCode = async () => {
    if (email) {
      console.log("verificationCode", verificationCode);
      try {
        await verifyCode();
        setStep("ResetPassword");
        showEmailVirificationCompleteToast();
      } catch (error) {
        showProblemToast("인증 코드 검증에 실패했어요.");
      }
    } else {
      setFormValidation((prev) => ({
        ...prev,
        email: {
          state: "ERROR",
          errorText: "이메일을 입력해주세요.",
        },
      }));
    }
  };

  const onSubmit = async () => {
    if (step === "ResetPassword") {
      try {
        if (!email || !newPassword || !confirmPassword) {
          throw new Error("모든 필드를 입력해주세요.");
        }
        const oneTimeToken = await getToken("oneTimeToken");
        if (!oneTimeToken) {
          throw new Error("일회용 토큰이 없습니다.");
        }

        await resetPasswordSchema.parseAsync({
          email,
          newPassword,
          confirmPassword,
        });
        console.log({
          email,
          newPassword,
          oneTimeToken,
        });

        await resetPassword({
          email,
          newPassword,
          oneTimeToken,
        });

        await deleteToken("oneTimeToken");
        navigation.goBack();
        showResetPasswordCompleteToast();
      } catch (error) {
        if (error instanceof z.ZodError) {
          // 전체 폼 검증 실패 시 에러 처리
          console.error("폼 검증 실패:", error.errors);
        } else if (error instanceof Error) {
          showProblemToast("오류: " + error.message);
        } else {
          showProblemToast();
        }
      }
    }
  };

  return {
    step,
    nextStep,
    prevStep,
    onClose,
    
    email,
    setEmail,
    emailValidation,
    validateEmail,
    
    isSendingCodeLoading,
    isSendingCodeError,
    isSendingCode,

    newPassword,
    setNewPassword,
    newPasswordValidation,
    validateNewPassword,
  
    confirmPassword,
    setConfirmPassword,
    confirmPasswordValidation,
    validateConfirmPassword,
  
    sendVerificationCode: onPressSendVerificationCode,
  
    verificationCode,
    setVerificationCode,
    verificationCodeValidation,
    validateVerificationCode,
  
    onVerifyCode,
    isVerifyingCodeLoading,
    isVerifyingCodeError,
  
    isCanNextStep,

    resetPassword: onSubmit,
    isResetPasswordLoading,
    isResetPasswordError,
    
  };
};

export default useResetPasswordSteps;
