import { useCallback, useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";

import {
  FieldReturn,
  useValidatedForm,
} from "@hongpung/src/common/lib/useValidatedForm";

import {
  EmailFormData,
  VerificationCodeFormData,
  verificationCodeSchema,
} from "./signUpSchema";

import {
  useIsRegisteredEmailRequest,
  useSendSignUpVerificationCodeRequest,
  useVerifySignUpVerificationCodeRequest,
} from "@hongpung/src/entities/auth";

export const useEmailValdiationStep = ({
  getField: getEmailField,
  getValues: getEmailValues,
  validateAll: validateEmail,
}: {
  getField: (fieldName: "email") => FieldReturn<EmailFormData["email"]>;
  getValues: (fieldName: "email") => EmailFormData["email"];
  validateAll: () => Promise<boolean>;
}) => {
  const [isSendCode, setIsSendCode] = useState(false);
  const { request: isRegisteredEmail, isLoading: isCheckingEmailLoading } =
    useIsRegisteredEmailRequest();

  const {
    request: sendVerificationCodeRequest,
    isLoading: isSendingVerificationCodeLoading,
  } = useSendSignUpVerificationCodeRequest();

  const { request: verifyCodeRequest, isLoading: isVerifyingCodePending } =
    useVerifySignUpVerificationCodeRequest();

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

  const getField = useCallback(
    <T extends "email" | "verificationCode">(
      fieldName: T
    ): FieldReturn<(EmailFormData & VerificationCodeFormData)[T]> => {
      if (fieldName === "email") {
        return getEmailField(fieldName) as unknown as FieldReturn<
          (EmailFormData & VerificationCodeFormData)[T]
        >;
      }
      return getVerificationCodeField(fieldName) as unknown as FieldReturn<
        (EmailFormData & VerificationCodeFormData)[T]
      >;
    },
    [getEmailField("email"), getVerificationCodeField("verificationCode")]
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
        if (isRegistered === true) {
          getEmailField("email").setValidation({
            state: "ERROR",
            errorText: "이미 가입된 이메일이에요.",
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
      getEmailField("email"),
      getEmailValues("email"),
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

        const { isVerified } = await verifyCodeRequest({
          code: verificationCode,
          email: email,
        });

        if (isVerified === false) {
          getVerificationCodeField("verificationCode").setValidation({
            state: "ERROR",
            errorText: "인증번호가 일치하지 않습니다.",
          });
          return;
        }
        onSuccess?.();
      } catch (error) {
        console.log(error);
        onError?.();
      }
    },
    [
      getEmailField("email"),
      getEmailValues("email"),
      getVerificationCodeField("verificationCode"),
      getVerificationCodeValues("verificationCode"),
      verifyCodeRequest,
      validateVerificationCode,
    ]
  );

  const isSendVerificationCodePending = useMemo(
    () => isCheckingEmailLoading || isSendingVerificationCodeLoading,
    [isCheckingEmailLoading, isSendingVerificationCodeLoading]
  );

  const isCanSendVerificationCode = useMemo(
    () => getEmailField("email").validation.state === "VALID",
    [getEmailField("email")]
  );

  return {
    getField,
    emailRef,
    verificationCodeRef,

    isCanSendVerificationCode,
    isCanVerifyCode: isVerificationCodeFormValid && isCanSendVerificationCode,

    sendVerificationCode,
    isSendVerificationCodePending,
    isSendCode,

    verifyCode,
    isVerifyingCodePending,
  };
};
