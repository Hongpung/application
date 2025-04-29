import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  useIsRegisteredEmailRequest,
  useSendSignUpVerificationCodeRequest as useSendVerificationCodeRequest,
  useSignUpRequest,
  useVerifySignUpVerificationCodeRequest as useVerifyCodeRequest,
} from "@hongpung/src/entities/auth";
import { ValidationState } from "@hongpung/src/common";
import { signUpSchema, type SignUpFormData } from "./signUpSchema";
import * as z from "zod";
import { Alert, BackHandler, TextInput } from "react-native";
import { clubNames } from "@hongpung/src/entities/club";
import { SignUpStep } from "./type";

const useSignUpSteps = () => {
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

  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    club: null,
    enrollmentNumber: "",
    nickname: "",
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // 뒤로가기 막기
        Alert.alert(
          "확인",
          "회원가입을 취소하시겠습니까?",
          [
            { text: "닫기" },
            {
              text: "취소",
              style: "destructive",
              onPress: () => {
                navigation.goBack();
              },
            },
          ],
          { cancelable: true }
        );
        return true; // true를 리턴하면 뒤로가기가 막힘
      }
    );

    return () => {
      // 컴포넌트 unmount 시 이벤트 제거
      backHandler.remove();
    };
  }, []);

  const [verificationCodeValidation, setVerificationCodeValidation] =
    useState<ValidationState>({
      state: "BEFORE",
    });

  const [formValidation, setFormValidation] = useState<{
    [key in keyof Required<SignUpFormData>]: ValidationState;
  }>({
    email: { state: "BEFORE" },
    password: { state: "BEFORE" },
    confirmPassword: { state: "BEFORE" },
    name: { state: "BEFORE" },
    nickname: { state: "VALID" },
    club: { state: "BEFORE" },
    enrollmentNumber: { state: "BEFORE" },
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
    Alert.alert(
      "확인",
      "회원가입을 취소하시겠습니까?",
      [
        { text: "닫기" },
        {
          text: "취소",
          style: "destructive",
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const validations = useMemo(
    () => ({
      emailValidation: formValidation.email,
      passwordValidation: formValidation.password,
      confirmPasswordValidation: formValidation.confirmPassword,
      clubValidation: formValidation.club,
      nameValidation: formValidation.name,
      nicknameValidation: formValidation.nickname,
      enrollmentNumberValidation: formValidation.enrollmentNumber,
    }),
    [formValidation]
  );

  const setForm = useMemo(
    () => ({
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
      setClub: (club: ClubName) => {
        setFormValidation((prev) => ({
          ...prev,
          club: { state: "PENDING" },
        }));
        setFormData((prev) => ({ ...prev, club }));
      },
      setEnrollmentNumber: (enrollmentNumber: string) => {
        setFormValidation((prev) => ({
          ...prev,
          enrollmentNumber: { state: "PENDING" },
        }));
        setFormData((prev) => ({
          ...prev,
          enrollmentNumber,
        }));
      },
    }),
    [setFormValidation, setFormData]
  );

  const validateForm = useMemo(
    () => ({
      validateEmail: async (email: string) => {
        try {
          await signUpSchema.innerType().shape.email.parseAsync(email);
          const { isRegistered } = await isDuplicatedEmail({ email });
          if (isRegistered === true) {
            setFormValidation((prev) => ({
              ...prev,
              email: {
                state: "ERROR",
                errorText: "이미 사용중인 이메일입니다.",
              },
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
              confirmPassword: {
                state: "ERROR",
                errorText: error.errors[0].message,
              },
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
      validateClub: (club: ClubName | undefined) => {
        if (!club) {
          setFormValidation((prev) => ({
            ...prev,
            club: { state: "ERROR", errorText: "동아리를 선택해주세요." },
          }));
          return;
        }
        try {
          signUpSchema.innerType().shape.club.parse(club);
          setFormValidation((prev) => ({
            ...prev,
            club: { state: "VALID" },
          }));
        } catch (error) {
          if (error instanceof z.ZodError) {
            setFormValidation((prev) => ({
              ...prev,
              club: { state: "ERROR", errorText: error.errors[0].message },
            }));
          }
        }
      },
      validateNickname: (nickname: string) => {
        if (!nickname || nickname.length === 0) {
          setFormValidation((prev) => ({
            ...prev,
            nickname: { state: "VALID" },
          }));
          return;
        }
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
          signUpSchema
            .innerType()
            .shape.enrollmentNumber.parse(enrollmentNumber);
          setFormValidation((prev) => ({
            ...prev,
            enrollmentNumber: { state: "VALID" },
          }));
        } catch (error) {
          if (error instanceof z.ZodError) {
            setFormValidation((prev) => ({
              ...prev,
              enrollmentNumber: {
                state: "ERROR",
                errorText: error.errors[0].message,
              },
            }));
          }
        }
      },
    }),
    [formData, setFormValidation]
  );

  const isCanNextStep = useMemo(() => {
    if (step === "EmailConfirm") {
      return formValidation.email?.state === "VALID";
    }
    if (step === "Password") {
      return (
        formValidation.email?.state === "VALID" &&
        formValidation.password?.state === "VALID" &&
        formValidation.confirmPassword?.state === "VALID"
      );
    }
    if (step === "PersonalInfo") {
      return (
        formValidation.email?.state === "VALID" &&
        formValidation.password?.state === "VALID" &&
        formValidation.confirmPassword?.state === "VALID" &&
        formValidation.name?.state === "VALID" &&
        formValidation.enrollmentNumber?.state === "VALID"
      );
    }
    return false;
  }, [step, formValidation]);

  const onSubmit = async () => {
    if (step === "PersonalInfo") {
      try {
        if (
          !formData.email ||
          !formData.password ||
          !formData.name ||
          !formData.enrollmentNumber ||
          !formData.club
        ) {
          throw new Error("모든 필드를 입력해주세요.");
        }
        const clubId = clubNames.findIndex((club) => club === formData.club);
        if (clubId === -1) {
          throw new Error("유효하지 않은 동아리입니다.");
        }
        await signUpSchema.parseAsync(formData);
        signUp({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          nickname: formData.nickname,
          clubId,
          enrollmentNumber: formData.enrollmentNumber.toString(),
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          // 전체 폼 검증 실패 시 에러 처리
          console.error("폼 검증 실패:", error.errors);
        } else if (error instanceof Error) {
          Alert.alert("회원가입 실패", error.message, [{ text: "확인" }]);
        } else {
          Alert.alert("회원가입 실패:", "알 수 없는 오류가 발생했어요.");
        }
      }
    } else {
      nextStep();
    }
  };

  const validateVerificationCode = async (code: string) => {
    if (code.length !== 6) {
      setVerificationCodeValidation({
        state: "ERROR",
        errorText: "6자리 숫자를 입력해주세요.",
      });
      return;
    }
  };

  const onPressSendVerificationCode = async () => {
    if (formData.email) {
      await validateForm.validateEmail(formData.email);
      if (formValidation.email.state === "ERROR") {
        return;
      }
      try {
        await sendVerificationCode({
          email: formData.email,
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

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      setVerificationCodeValidation({
        state: "ERROR",
        errorText: "6자리 숫자를 입력해주세요.",
      });
      return;
    }
    if (formData.email) {
      console.log("verificationCode", verificationCode);
      try {
        await requestVerifyingCode({
          code: verificationCode,
          email: formData.email,
        });
        setStep("Password");
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
    validateForm.validateClub(formData.club || undefined);
  };

  const onSignUp = async () => {
    await onSubmit();
    if (isCanNextStep) {
      await onSubmit();
    }
  };

  return {
    step,
    nextStep,
    prevStep,
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
    ...setForm,
    ...formData,
    ...validateForm,
    ...validations,
    isCanNextStep,
    isSignUpLoading,
    isSignUpError,
    isDuplicatedEmailLoading,
    signUp: onSignUp,
  };
};

export default useSignUpSteps;
