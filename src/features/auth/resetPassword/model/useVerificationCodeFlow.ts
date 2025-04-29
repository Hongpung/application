import { saveToken, ValidationState } from "@hongpung/src/common";
import { useVerifyResetPasswordVerificationCodeRequest } from "@hongpung/src/entities/auth";
import { useCallback, useState } from "react";

const useVerificationCodeFlow = (email: string) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCodeValidation, setVerificationCodeValidation] =
    useState<ValidationState>({
      state: "BEFORE",
    });

  const {
    request: verifyCodeRequest,
    isLoading: isVerifyingCodeLoading,
    error: isVerifyingCodeError,
  } = useVerifyResetPasswordVerificationCodeRequest();

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      setVerificationCodeValidation({
        state: "ERROR",
        errorText: "6자리 숫자를 입력해주세요.",
      });
      return;
    }
    try {
      const { token } = await verifyCodeRequest({
        code: verificationCode,
        email: email,
      });

      if (!token) {
        throw Error("토큰을 받지 못했어요");
      }
      await saveToken("oneTimeToken", token);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("알 수 없는 오류가 발생했어요");
    }
  };

  const validateVerificationCode = useCallback((verificationCode: string) => {
    if (verificationCode.length !== 6) {
      setVerificationCodeValidation({
        state: "ERROR",
        errorText: "6자리 숫자를 입력해주세요.",
      });
    }
    setVerificationCodeValidation({
      state: "VALID",
    });
  }, []);

  return {
    verificationCode,
    setVerificationCode,
    verificationCodeValidation,
    verifyCode,
    isVerifyingCodeLoading,
    isVerifyingCodeError,
    validateVerificationCode,
  };
};

export default useVerificationCodeFlow;
