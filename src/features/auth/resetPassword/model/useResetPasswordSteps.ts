import { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler } from "react-native";

import { useNavigation } from "@react-navigation/native";

import * as z from "zod";

import { Alert, deleteToken, getToken } from "@hongpung/src/common";

import {
  useSendResetPasswordVerificationCodeRequest as useSendVerificationCodeRequest,
  useResetPasswordRequest,
} from "@hongpung/src/entities/auth";

import {
  showEmailVirificationCompleteToast,
  showProblemToast,
  showResetPasswordCompleteToast,
} from "../constant/toastActions";

import { resetPasswordSchema } from "./resetPasswordSchema";
import {
  EmailValidateFormProps,
  ResetPasswordFormProps,
  ResetPasswordStep,
} from "./type";
import { useVerificationCodeFlow } from "./useVerificationCodeFlow";
import { useResetPasswordForm } from "./useResetPasswordForm";

const useResetPasswordSteps = (): {
  step: ResetPasswordStep;
  setStep: (step: ResetPasswordStep) => void;
  onClose: () => void;
  isCanNextStep: boolean;
} & EmailValidateFormProps &
  ResetPasswordFormProps => {
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
    setEmailValidation,
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

  const onClose = useCallback(() => {
    Alert.confirm("확인", "비밀번호 재설정을 취소하고\n뒤로 돌아갈까요?", {
      cancelText: "아니오",
      confirmText: "네",
      confirmButtonColor: "green",
      cancelButtonColor: "green",
      onConfirm: () => {
        navigation.goBack();
      },
    });
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true; // true를 리턴하면 뒤로가기가 막힘
      },
    );

    return () => {
      // 컴포넌트 unmount 시 이벤트 제거
      backHandler.remove();
    };
  }, [onClose]);

  const { request: resetPassword } = useResetPasswordRequest();
  const {
    request: sendVerificationCode,
    isLoading: isSendingCodeLoading,
    error: isSendingCodeError,
  } = useSendVerificationCodeRequest();

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
  }, [
    step,
    emailValidation,
    verificationCodeValidation,
    newPasswordValidation,
    confirmPasswordValidation,
  ]);

  const onPressSendVerificationCode = async () => {
    if (email) {
      await validateEmail();
      if (emailValidation.state !== "VALID") {
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
      setEmailValidation({
        state: "ERROR",
        errorText: "이메일을 입력해주세요.",
      });
    }
  };

  const onVerifyCode = async ({ onSuccess }: { onSuccess: () => void }) => {
    console.log("verificationCode", verificationCode);
    try {
      await verifyCode({ onSuccess });
      setStep("ResetPassword");
      showEmailVirificationCompleteToast();
    } catch {
      showProblemToast("인증 코드 검증에 실패했어요.");
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
    setStep,
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
  };
};

export default useResetPasswordSteps;
