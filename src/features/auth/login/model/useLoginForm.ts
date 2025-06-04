import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";
import { StackActions, useNavigation } from "@react-navigation/native";
import { debounce } from "lodash";
import { useLoginRequest } from "@hongpung/src/entities/auth";
import { saveToken, ValidationState } from "@hongpung/src/common";
import { useValidatedForm } from "@hongpung/src/common/lib/useValidatedForm";
import { LoginSchema } from "./LoginSchema";
import {
  saveIDToast,
  setAutoLoginToast,
  signUpPendingToast,
} from "../lib/toast";

interface LoginFormValue {
  email: string;
  password: string;
}

async function loadLoginSetting(
  setOptions: React.Dispatch<
    React.SetStateAction<{ autoLogin: boolean; saveID: boolean }>
  >,
  setEmail: (email: string) => void,
  setEmailValidation: (newValidation: ValidationState) => void,
) {
  try {
    await AsyncStorage.removeItem("autoLogin");

    const loadedSaveID = await AsyncStorage.getItem("saveID"); //아이디 세이브인지 확인

    if (loadedSaveID) {
      const loadedEmail = await AsyncStorage.getItem("Email");

      if (!loadedEmail) {
        setOptions((prev) => ({ ...prev, saveID: false }));
        return;
      }

      setOptions((prev) => ({ ...prev, saveID: true }));
      setEmail(loadedEmail);
      setEmailValidation({ state: "VALID" });
    }

    return;
  } catch (e) {
    console.error(e);
  }
}
async function saveLoginOptions({
  email,
  autoLogin,
  saveID,
}: {
  email: string;
  autoLogin: boolean;
  saveID: boolean;
}) {
  if (autoLogin) {
    await AsyncStorage.setItem("autoLogin", "true");
    await AsyncStorage.setItem("saveID", "true");
    await AsyncStorage.setItem("Email", email);
    setAutoLoginToast();
  } else if (saveID) {
    await AsyncStorage.removeItem("autoLogin");
    await AsyncStorage.setItem("saveID", "true");
    await AsyncStorage.setItem("Email", email);
    saveIDToast();
  } else {
    await AsyncStorage.removeItem("saveID");
    await AsyncStorage.removeItem("Email");

    //성공 시 별도 toast 없음
  }
}

export const useLoginForm = () => {
  const navigation = useNavigation();

  const inputForm = useValidatedForm({
    schema: LoginSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    email,
    password,
    emailValidation,
    passwordValidation,
    setEmail,
    validateEmail,
    validatePassword,
    setEmailValidation,
    setPasswordValidation,
  } = inputForm;

  //formData는 로그인 정보를 담는 상태관리 변수
  const { request: login, isLoading } = useLoginRequest();

  //emailRef, passwordRef는 InputBaseComponent의의 ref를 담는 변수
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  //options는 로그인 옵션을 담는 상태관리 변수
  const [options, setOptions] = useState({ autoLogin: false, saveID: false });

  //페이지 로드전에 로그인 옵션을 로드하고 사전 정보를 입력
  useLayoutEffect(() => {
    //loadLoginSetting은 로그인 옵션을 로드하고 사전 정보를 입력하는 함수
    loadLoginSetting(setOptions, setEmail, setEmailValidation);
  }, [setOptions, setEmail, setEmailValidation]);

  const setSaveID = (value: boolean) => {
    if (value) setOptions((prev) => ({ ...prev, saveID: value }));
    else setOptions({ saveID: false, autoLogin: false });
  };

  const setAutoLogin = (value: boolean) => {
    if (value) setOptions({ saveID: true, autoLogin: true });
    else setOptions((prev) => ({ ...prev, autoLogin: false }));
  };

  //onBlurValidateAllInput은 모든 input에 대해 유효성 검사를 하는 함수
  //이 함수는 onBlur 이벤트가 발생할 때 실행됨
  const onBlurValidateAllInput = useCallback(() => {
    if (passwordValidation.state !== "BEFORE") {
      validatePassword();
    }

    if (emailValidation.state !== "BEFORE") {
      validateEmail();
    }
  }, [
    validateEmail,
    validatePassword,
    emailValidation.state,
    passwordValidation.state,
  ]);

  //tryLogin은 로그인을 시도하는 함수
  const tryLogin = useCallback(async () => {
    Keyboard.dismiss();
    validateEmail();
    validatePassword();
    if (emailValidation.state === "ERROR") {
      emailRef.current?.focus();
      return;
    }

    if (passwordValidation.state === "ERROR") {
      passwordRef.current?.focus();
      return;
    }

    try {
      const { autoLogin, saveID } = options;
      const formData: LoginFormValue = {
        email,
        password,
      };
      const { token } = await login(formData);

      if (!token) {
        throw new Error("로그인 실패");
      }

      await saveToken("token", token);
      await saveLoginOptions({ email, autoLogin, saveID });

      navigation.dispatch(StackActions.replace("Main"));
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message === "Check Email Or Password!") {
          setEmailValidation({ state: "ERROR", errorText: "" });
          setPasswordValidation({
            state: "ERROR",
            errorText: "비밀번호가 틀리거나 가입되지 않은 이메일이에요.",
          });
        }
        if (e.message === "You're not accepted") {
          signUpPendingToast();
        }
      }
      // else console.error(e)
    }
  }, [
    options,
    emailValidation,
    passwordValidation,
    emailRef,
    passwordRef,
    navigation,
    login,
    setEmailValidation,
    setPasswordValidation,
    email,
    password,
    validateEmail,
    validatePassword,
  ]);

  //onLogin은 로그인을 시도하는 함수를 디바운스 처리한 함수
  const onLogin = debounce(tryLogin, 500, { leading: true, trailing: false });

  return {
    emailRef,
    passwordRef,

    onBlurValidateAllInput,

    ...inputForm,

    options,
    setSaveID,
    setAutoLogin,

    onLogin,
    isLoading,
  };
};
