import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";

import { TextInput } from "react-native-gesture-handler";
import { StackActions, useNavigation } from "@react-navigation/native";
import { debounce } from "lodash";
import { useLoginRequest } from "@hongpung/src/entities/auth";
import { saveToken } from "@hongpung/src/common";
import { useValidatedForm } from "@hongpung/src/common/lib/useValidatedForm";
import { LoginSchema } from "./LoginSchema";
import { signUpPendingToast } from "../lib/toast";

import { loadLoginSetting, saveLoginOptions } from "./loginStorage";

export const useLoginForm = () => {
  const navigation = useNavigation();
  //formData는 로그인 정보를 담는 상태관리 변수
  const { request: login, isLoading } = useLoginRequest();

  //emailRef, passwordRef는 InputBaseComponent의의 ref를 담는 변수
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  //options는 로그인 옵션을 담는 상태관리 변수
  const [options, setOptions] = useState({ autoLogin: false, saveID: false });

  const { getField, trigger, getValues } = useValidatedForm({
    schema: LoginSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //페이지 로드전에 로그인 옵션을 로드하고 사전 정보를 입력
  useLayoutEffect(() => {
    //loadLoginSetting은 로그인 옵션을 로드하고 사전 정보를 입력하는 함수
    loadLoginSetting(
      setOptions,
      getField("email").setValue,
      getField("email").setValidation
    );
  }, []);

  const setSaveID = (value: boolean) => {
    if (value) setOptions((prev) => ({ ...prev, saveID: value }));
    else setOptions({ saveID: false, autoLogin: false });
  };

  const setAutoLogin = (value: boolean) => {
    if (value) setOptions({ saveID: true, autoLogin: true });
    else setOptions((prev) => ({ ...prev, autoLogin: false }));
  };

  //tryLogin은 로그인을 시도하는 함수
  const tryLogin = useCallback(async () => {
    Keyboard.dismiss();
    const emailValidation = await trigger(["email"]);
    if (!emailValidation) {
      emailRef.current?.focus();
      return;
    }

    const passwordValidation = await trigger(["password"]);
    if (!passwordValidation) {
      passwordRef.current?.focus();
      return;
    }

    try {
      const { autoLogin, saveID } = options;
      const { email, password } = getValues(["email", "password"]);
      const { token } = await login({ email, password });

      if (!token) {
        throw new Error("로그인 실패");
      }

      await saveToken("token", token);
      await saveLoginOptions({ email, autoLogin, saveID });

      navigation.dispatch(StackActions.replace("Main"));
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message === "Check Email Or Password!") {
          getField("email").setValidation({ state: "ERROR", errorText: "" });
          getField("password").setValidation({
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
  }, [options, getField, trigger, emailRef, passwordRef, navigation, login]);

  //onLogin은 로그인을 시도하는 함수를 디바운스 처리한 함수
  const onLogin = useCallback(
    debounce(tryLogin, 500, { leading: true, trailing: false }),
    [tryLogin]
  );

  return {
    emailRef,
    passwordRef,

    getField,
    trigger,

    options,
    setSaveID,
    setAutoLogin,

    onLogin,
    isLoading,
  };
};
