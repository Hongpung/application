import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";
import { StackActions, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { debounce } from "lodash";
import { useLoginRequest } from "@hongpung/src/entities/auth";
import { saveToken } from "@hongpung/src/common";
import { useValidatedForm } from "@hongpung/src/common/lib/useValidatedForm";
import { LoginSchema } from "./LoginSchema";

interface LoginFormValue {
  email: string;
  password: string;
}

export const useLoginForm = () => {
  const navigation = useNavigation();

  const formDatas = useValidatedForm({
    schema: LoginSchema,
    defaultValues: {
      email: "",
      password: "",
    },
    initialValidation:{
      email:{state:"ERROR", errorText:"이메일을 입력해주세요"},
    }
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
  } = formDatas;

  //formData는 로그인 정보를 담는 상태관리 변수
  const { request: login, isLoading, error } = useLoginRequest();

  //emailRef, passwordRef는 InputBaseComponent의의 ref를 담는 변수
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  //options는 로그인 옵션을 담는 상태관리 변수
  const [options, setOptions] = useState({ autoLogin: false, saveID: false });

  //페이지 로드전에 로그인 옵션을 로드하고 사전 정보를 입력
  useLayoutEffect(() => {
    //loadLoginSetting은 로그인 옵션을 로드하고 사전 정보를 입력하는 함수
    const loadLoginSetting = async () => {
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
    };

    loadLoginSetting();
  }, []);

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
    if (passwordValidation.state != "BEFORE") {
      validatePassword();
    }

    if (emailValidation.state != "BEFORE") {
      validateEmail();
    }
  }, [formDatas]);

  const saveLoginOptions = useCallback(
    async ({
      email,
      autoLogin,
      saveID,
    }: {
      email: string;
      autoLogin: boolean;
      saveID: boolean;
    }) => {
      if (autoLogin) {
        await AsyncStorage.setItem("autoLogin", "true");
        await AsyncStorage.setItem("saveID", "true");
        await AsyncStorage.setItem("Email", email);
        Toast.show({
          type: "success",
          text1: "앞으로 앱 실행시 자동으로 로그인 돼요",
          position: "bottom",
          bottomOffset: 60,
          visibilityTime: 3000,
        });
      } else if (saveID) {
        await AsyncStorage.removeItem("autoLogin");
        await AsyncStorage.setItem("saveID", "true");
        await AsyncStorage.setItem("Email", email);

        Toast.show({
          type: "success",
          text1: "아이디를 저장했어요",
          position: "bottom",
          bottomOffset: 60,
          visibilityTime: 3000,
        });
      } else {
        await AsyncStorage.removeItem("saveID");
        await AsyncStorage.removeItem("Email");
      }
    },
    []
  );

  //tryLogin은 로그인을 시도하는 함수
  const tryLogin = useCallback(async () => {
    Keyboard.dismiss();
    validateEmail();
    validatePassword();
    if (emailValidation.state == "ERROR") {
      emailRef.current?.focus();
      return;
    }

    if (passwordValidation.state == "ERROR") {
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
      saveLoginOptions({ email, autoLogin, saveID });
      navigation.dispatch(StackActions.replace("Main"));
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (
          e.message == "Check Email Or Password!" ||
          e.message == "로그인 정보 불일치"
        ) {
          setEmailValidation({ state: "ERROR", errorText: "" });
          setPasswordValidation({
            state: "ERROR",
            errorText: "비밀번호가 틀리거나 가입되지 않은 이메일이에요.",
          });
        }
        if (e.message == "You're not accepted") {
          Toast.show({
            type: "fail",
            text1: "가입이 진행중인 계정입니다\n(승낙시 확인 메일이 발송돼요)",
            position: "bottom",
            bottomOffset: 60,
            visibilityTime: 3000,
          });
        }
      }
      // else console.error(e)
    }
  }, [formDatas,options]);

  //onLogin은 로그인을 시도하는 함수를 디바운스 처리한 함수
  const onLogin = debounce(tryLogin, 500, { leading: true, trailing: false });

  return {

    emailRef,
    passwordRef,

    onBlurValidateAllInput,

    ...formDatas,
    
    options,
    setSaveID,
    setAutoLogin,

    onLogin,
    isLoading,
    LoginError: error,
  };
};
