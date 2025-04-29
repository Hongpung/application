import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  turnOnAutoLoginSuccessToast,
  turnOnAutoLoginFailedToast,
  turnOffAutoLoginSuccessToast,
  turnOffAutoLoginFailedToast,
} from "../lib/toast";

const useAutoLogin = () => {
  const [autoLogin, setAutoLogin] = useState(false);
  const autoLoginRef = useRef(autoLogin);
  const isChangedRef = useRef(false);

  useEffect(() => {
    autoLoginRef.current = autoLogin;
  }, [autoLogin]);

  useEffect(() => {
    const getAutoLogin = async () => {
      try {
        const prevAutoLogin = (await AsyncStorage.getItem("autoLogin")) || null;
        setAutoLogin(!!prevAutoLogin || false);
      } catch (e) {
        setAutoLogin(false);
      }
    };

    getAutoLogin();
  }, []);

  const turnOnAutoLogin = useCallback(async () => {
    try {
      await AsyncStorage.setItem("autoLogin", "true");
      turnOnAutoLoginSuccessToast();
    } catch (e) {
      console.error(e);
      setAutoLogin(false);
      turnOnAutoLoginFailedToast();
    }
  }, []);

  const turnOffAutoLogin = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("autoLogin");
      turnOffAutoLoginSuccessToast();
    } catch (e) {
      console.error(e);
      setAutoLogin(true);
      turnOffAutoLoginFailedToast();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (isChangedRef.current) {
        if (autoLoginRef.current) turnOnAutoLogin();
        else turnOffAutoLogin();
      }
    };
  }, []);

  const toggleAutoLogin = useCallback(() => {
    isChangedRef.current = true;
    setAutoLogin((prev) => !prev);
  }, []);

  return [autoLogin, toggleAutoLogin] as const;
};

export default useAutoLogin;
