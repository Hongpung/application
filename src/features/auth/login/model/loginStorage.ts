import AsyncStorage from "@react-native-async-storage/async-storage";
import { ValidationState } from "@hongpung/src/common";

export async function loadLoginSetting(
  setOptions: React.Dispatch<
    React.SetStateAction<{ autoLogin: boolean; saveID: boolean }>
  >,
  setEmail: (email: string) => void,
  setEmailValidation: (newValidation: ValidationState) => void
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

export async function saveLoginOptions({
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

// Toast 함수들 (실제 구현에 맞게 수정 필요)
function setAutoLoginToast() {
  // 자동 로그인 토스트 구현
}

function saveIDToast() {
  // 아이디 저장 토스트 구현
}
