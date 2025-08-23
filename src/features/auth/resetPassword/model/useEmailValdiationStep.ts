import { useCallback, useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";

import {
  FieldReturn,
  useValidatedForm,
} from "@hongpung/src/common/lib/useValidatedForm";

import {
  EmailFormData,
  VerificationCodeFormData,
  emailSchema,
  verificationCodeSchema,
} from "./resetPasswordSchema";

import {
  useIsRegisteredEmailRequest,
  useSendResetPasswordVerificationCodeRequest,
  useVerifyResetPasswordVerificationCodeRequest,
} from "@hongpung/src/entities/auth";
import { saveToken } from "@hongpung/src/common";

export const useEmailValdiationStep = () => {
  const [isSendCode, setIsSendCode] = useState(false);
  const { request: isRegisteredEmail, isLoading: isCheckingEmailLoading } =
    useIsRegisteredEmailRequest();

  const {
    request: sendVerificationCodeRequest,
    isLoading: isSendingVerificationCodeLoading,
  } = useSendResetPasswordVerificationCodeRequest();

  const { request: verifyCodeRequest, isLoading: isVerifyingCodePending } =
    useVerifyResetPasswordVerificationCodeRequest();

  const {
    getField: getEmailField,
    getValues: getEmailValues,
    validateAll: validateEmail,
    isFormValid: isEmailFormValid,
  } = useValidatedForm({
    schema: emailSchema,
    defaultValues: {
      email: "",
    },
  });

  const {
    getField: getVerificationCodeField,
    getValues: getVerificationCodeValues,
    validateAll: validateVerificationCode,
    isFormValid: isVerificationCodeFormValid,
  } = useValidatedForm({
    schema: verificationCodeSchema,
    defaultValues: {
      verificationCode: "",
    },
  });

  const emailRef = useRef<TextInput | null>(null);
  const verificationCodeRef = useRef<TextInput | null>(null);

  const getField =
    useCallback(
      <T extends "email" | "verificationCode">(
        fieldName: T
      ): FieldReturn<(EmailFormData&VerificationCodeFormData)[T]> => {
        if (fieldName === "email") {
          return getEmailField(fieldName) as unknown as FieldReturn<(EmailFormData&VerificationCodeFormData)[T]>;
        }
        return getVerificationCodeField(fieldName) as unknown as FieldReturn<(EmailFormData&VerificationCodeFormData)[T]>;
      },
      [getEmailField, getVerificationCodeField]
    );

  const sendVerificationCode = useCallback(
    async ({
      onSuccess,
      onError,
    }: {
      onSuccess?: () => void;
      onError?: () => void;
    }) => {
      try {
        const emailValidation = await validateEmail();
        if (emailValidation === false) return;
        const email = getEmailValues("email");
        const { isRegistered } = await isRegisteredEmail({ email });
        if (isRegistered === false) {
          getEmailField("email").setValidation({
            state: "ERROR",
            errorText: "가입 정보가 없는 이메일이에요.",
          });
          return;
        }
        await sendVerificationCodeRequest({ email });
        setIsSendCode(true);
        onSuccess?.();
      } catch (error) {
        onError?.();
        throw error;
      }
    },
    [
      getEmailField,
      getEmailValues,
      isRegisteredEmail,
      sendVerificationCodeRequest,
    ]
  );

  const verifyCode = useCallback(
    async ({
      onSuccess,
      onError,
    }: {
      onSuccess?: () => void;
      onError?: () => void;
    }) => {
      try {
        const verificationCodeValidation = await validateVerificationCode();
        if (verificationCodeValidation === false) return;
        const verificationCode = getVerificationCodeValues("verificationCode");
        const email = getEmailValues("email");
        console.log({email, verificationCode})

        const { token } = await verifyCodeRequest({
          code: verificationCode,
          email: email,
        });

        if(token === null) {
          getVerificationCodeField("verificationCode").setValidation({
            state: "ERROR",
            errorText: "인증번호가 일치하지 않습니다.",
          });
          return;
        }

        await saveToken("temp-token", token);
        onSuccess?.();
      } catch (error) {
        console.log(error);
        onError?.();
      }
    },
    [
      getEmailField,
      getEmailValues,
      getVerificationCodeField,
      getVerificationCodeValues,
      verifyCodeRequest,
      validateVerificationCode,
    ]
  );

  const isSendVerificationCodePending = useMemo(
    () => isCheckingEmailLoading || isSendingVerificationCodeLoading,
    [isCheckingEmailLoading, isSendingVerificationCodeLoading]
  );

  return {
    getField,
    emailRef,
    verificationCodeRef,

    isCanSendVerificationCode: isEmailFormValid,
    isCanVerifyCode: isVerificationCodeFormValid && isEmailFormValid,

    sendVerificationCode,
    isSendVerificationCodePending,
    isSendCode,

    verifyCode,
    isVerifyingCodePending,
  };
};
