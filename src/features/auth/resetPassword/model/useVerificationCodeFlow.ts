import {
  saveToken,
  useValidatedForm,
  ValidationState,
} from "@hongpung/src/common";
import { useVerifyResetPasswordVerificationCodeRequest } from "@hongpung/src/entities/auth";
import { useCallback, useRef, useMemo } from "react";
import { TextInput } from "react-native";
import { verificationCodeSchema } from "./verificationCodeSchema";

export type UseVerificationCodeFlowReturn = {
  verificationCodeRef: React.RefObject<TextInput | null>;
  verificationCode: string;
  setVerificationCode: (text: string) => void;
  verificationCodeValidation: ValidationState;
  onVerificationCodeBlur: () => void;
  verifyCode: ({ onSuccess }: { onSuccess: () => void }) => Promise<void>;
  isVerifyingCodeLoading: boolean;
  isVerifyingCodeError: Error | null;
  validateVerificationCode: (verificationCode: string) => void;
  isCanVerifyCode: boolean;
};

export const useVerificationCodeFlow = (
  email: string,
): UseVerificationCodeFlowReturn => {
  const verificationCodeRef = useRef<TextInput | null>(null);

  const formDatas = useValidatedForm({
    schema: verificationCodeSchema,
    defaultValues: {
      verificationCode: "",
    },
  });

  const {
    verificationCode,
    verificationCodeValidation,
    setVerificationCode,
    validateVerificationCode: validateVerificationCodeForm,
  } = formDatas;

  const {
    request: verifyCodeRequest,
    isLoading: isVerifyingCodeLoading,
    error: isVerifyingCodeError,
  } = useVerifyResetPasswordVerificationCodeRequest();

  const verifyCode = async ({ onSuccess }: { onSuccess: () => void }) => {
    if (verificationCode.length !== 6) {
      validateVerificationCodeForm();
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
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("알 수 없는 오류가 발생했어요");
    }
  };

  const validateVerificationCode = useCallback(
    (verificationCode: string) => {
      validateVerificationCodeForm();
    },
    [validateVerificationCodeForm],
  );

  const onVerificationCodeBlur = useCallback(() => {
    if (verificationCodeValidation.state !== "BEFORE") {
      validateVerificationCodeForm();
    }
  }, [verificationCodeValidation.state, validateVerificationCodeForm]);

  const isCanVerifyCode = useMemo(() => {
    return verificationCodeValidation.state === "VALID";
  }, [verificationCodeValidation.state]);

  return {
    verificationCodeRef,
    verificationCode,
    setVerificationCode,
    verificationCodeValidation,
    onVerificationCodeBlur,
    verifyCode,
    isVerifyingCodeLoading,
    isVerifyingCodeError,
    validateVerificationCode,
    isCanVerifyCode,
  };
};
