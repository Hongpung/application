import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  useIsRegisteredEmailRequest,
  useSendSignUpVerificationCodeRequest as useSendVerificationCodeRequest,
  useSignUpRequest,
  useVerifySignUpVerificationCodeRequest as useVerifyCodeRequest,
} from "@hongpung/src/entities/auth";
import { Alert, useValidatedForm, ValidationState } from "@hongpung/src/common";
import { signUpSchema } from "./signUpSchema";
import * as z from "zod";
import { BackHandler, TextInput } from "react-native";
import { clubNames } from "@hongpung/src/entities/club";
import { SignUpStep } from "./type";
import { onSignUpSuccessToast } from "../lib/toast";

export const useSignUpSteps = ({
  navigateToLoginPage,
}: {
  navigateToLoginPage: () => void;
}) => {
  const navigation = useNavigation();
  const [step, setStep] = useState<SignUpStep>("EmailConfirm");
  const [isSendingCode, setIsSendingCode] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);
  const nicknameRef = useRef<TextInput>(null);
  const enrollmentNumberRef = useRef<TextInput>(null);
  const verificationCodeRef = useRef<TextInput>(null);

  const [verificationCode, setVerificationCode] = useState("");

  const formDatas = useValidatedForm({
    schema: signUpSchema,
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      club: null,
      enrollmentNumber: "",
      nickname: undefined,
    },
  });

  const onClose = useCallback(() => {
    Alert.confirm("확인", "회원가입을 취소하고 뒤로 돌아갈까요?", {
      cancelText: "아니오",
      confirmText: "네",
      cancelButtonColor: "green",
      confirmButtonColor: "green",
      onConfirm: () => {
        navigation.goBack();
      },
    });
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // 뒤로가기 막기
        onClose();
        return true; // true를 리턴하면 뒤로가기가 막힘
      },
    );

    return () => {
      // 컴포넌트 unmount 시 이벤트 제거
      backHandler.remove();
    };
  }, [onClose]);

  const [verificationCodeValidation, setVerificationCodeValidation] =
    useState<ValidationState>({
      state: "BEFORE",
    });

  const [isClubOptionsVisible, setIsClubOptionsVisible] = useState(false);
  const {
    request: signUp,
    isLoading: isSignUpLoading,
    error: isSignUpError,
  } = useSignUpRequest();
  const {
    request: sendVerificationCode,
    isLoading: isSendingCodeLoading,
    error: isSendingCodeError,
  } = useSendVerificationCodeRequest();
  const { request: isDuplicatedEmail, isLoading: isDuplicatedEmailLoading } =
    useIsRegisteredEmailRequest();
  const {
    request: requestVerifyingCode,
    isLoading: isVerifyingCodeLoading,
    error: isVerifyingCodeError,
  } = useVerifyCodeRequest();

  const isCanNextStep = useMemo(() => {
    if (step === "EmailConfirm") {
      return formDatas.emailValidation.state === "VALID";
    }
    if (step === "SetPassword") {
      return (
        formDatas.emailValidation.state === "VALID" &&
        formDatas.passwordValidation.state === "VALID" &&
        formDatas.confirmPasswordValidation.state === "VALID"
      );
    }
    if (step === "PersonalInfo") {
      return (
        formDatas.emailValidation.state === "VALID" &&
        formDatas.passwordValidation.state === "VALID" &&
        formDatas.confirmPasswordValidation.state === "VALID" &&
        formDatas.nameValidation.state === "VALID" &&
        formDatas.enrollmentNumberValidation.state === "VALID"
      );
    }
    return false;
  }, [step, formDatas]);

  const onSubmit = async () => {
    if (step === "PersonalInfo") {
      try {
        const clubId = clubNames.findIndex((club) => club === formDatas.club);
        if (clubId === -1) {
          throw new Error("유효하지 않은 동아리입니다.");
        }
        await signUpSchema.parseAsync(formDatas);
        signUp({
          email: formDatas.email,
          password: formDatas.password,
          name: formDatas.name,
          nickname: formDatas.nickname,
          clubId,
          enrollmentNumber: formDatas.enrollmentNumber.toString(),
        });
        onSignUpSuccessToast();
        navigateToLoginPage();
      } catch (error) {
        if (error instanceof z.ZodError) {
          // 전체 폼 검증 실패 시 에러 처리
          console.error("폼 검증 실패:", error.errors);
        } else if (error instanceof Error) {
          Alert.alert("회원가입 실패", error.message);
        } else {
          Alert.alert("회원가입 실패:", "알 수 없는 오류가 발생했어요.");
        }
      }
    }
  };

  const validateEmail = useCallback(async () => {
    try {
      formDatas.validateEmail();
      await isDuplicatedEmail({ email: formDatas.email });
      formDatas.setEmailValidation({ state: "VALID" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("폼 검증 실패:", error.errors);
      }
    }
  }, [formDatas, isDuplicatedEmail]);

  const validateVerificationCode = async (code: string) => {
    if (code.length !== 6) {
      setVerificationCodeValidation({
        state: "ERROR",
        errorText: "6자리 숫자를 입력해주세요.",
      });
      return;
    }
    setVerificationCodeValidation({ state: "VALID" });
  };

  const onPressSendVerificationCode = async () => {
    if (formDatas.email) {
      await validateEmail();
      if (formDatas.emailValidation.state !== "VALID") {
        return;
      }
      try {
        await sendVerificationCode({
          email: formDatas.email,
        });
        setIsSendingCode(true);
      } catch {
        setIsSendingCode(false);
      }
      setIsSendingCode(true);
    } else {
      setVerificationCodeValidation({
        state: "ERROR",
        errorText: "이메일을 입력해주세요.",
      });
    }
  };

  const verifyCode = async ({ onSuccess }: { onSuccess: () => void }) => {
    if (verificationCode.length !== 6) {
      setVerificationCodeValidation({
        state: "ERROR",
        errorText: "6자리 숫자를 입력해주세요.",
      });
      return;
    }
    if (formDatas.email) {
      console.log("verificationCode", verificationCode);
      try {
        await requestVerifyingCode({
          code: verificationCode,
          email: formDatas.email,
        });
        onSuccess();
      } catch (error) {
        console.error("인증 코드 검증 실패:", error);
      }
    } else {
      setVerificationCodeValidation({
        state: "ERROR",
        errorText: "이메일을 입력해주세요.",
      });
    }
  };

  const dissmissClubOptions = () => {
    setIsClubOptionsVisible(false);
    formDatas.validateClub();
  };

  const onSignUp = async () => {
    await onSubmit();
    if (isCanNextStep) {
      await onSubmit();
    }
  };

  return {
    step,
    setStep,
    onClose,
    onSubmit,
    emailRef,
    passwordRef,
    confirmPasswordRef,
    nameRef,
    nicknameRef,
    enrollmentNumberRef,
    verificationCodeRef,
    isClubOptionsVisible,
    setIsClubOptionsVisible,
    sendVerificationCode: onPressSendVerificationCode,
    verificationCode,
    setVerificationCode,
    validateVerificationCode,
    verificationCodeValidation,
    isSendingCodeLoading,
    isSendingCodeError,
    verifyCode,
    isVerifyingCodeLoading,
    isVerifyingCodeError,
    isSendingCode,
    dissmissClubOptions,
    ...formDatas,
    validateEmail,
    isCanNextStep,
    isSignUpLoading,
    isSignUpError,
    isDuplicatedEmailLoading,
    signUp: onSignUp,
  };
};
