import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  Checkbox,
  Color,
  Input,
  LongButton,
  ValidationState,
} from "@hongpung/src/common";
import { TextInput } from "react-native-gesture-handler";

interface LoginFormValue {
  email: string;
  password: string;
}

type LoginFormValidation = {
  [key in keyof LoginFormValue]: ValidationState;
};

interface LoginFormProps {
  emailRef: React.RefObject<TextInput>;
  formData: LoginFormValue;
  formValidation: LoginFormValidation;
  onBlurValidateAllInput: () => void;
  onChangeFormData: (field: keyof LoginFormValue, value: string) => void;
  onLogin: () => void;
  options: { saveID: boolean; autoLogin: boolean };
  passwordRef: React.RefObject<TextInput>;
  setAutoLogin: (value: boolean) => void;
  setSaveID: (value: boolean) => void;
  isLoading: boolean;
  LoginError: Error | null;
}

const LoginForm: React.FC<LoginFormProps> = (props) => {
  const {
    emailRef,
    formData,
    formValidation,
    onBlurValidateAllInput,
    onChangeFormData,
    onLogin,
    options,
    passwordRef,
    setAutoLogin,
    setSaveID,
    isLoading,
    LoginError,
  } = props;

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          ref={emailRef}
          inputValue={formData.email}
          setInputValue={(email) => onChangeFormData("email", email)}
          label="이메일"
          keyboardType={"email-address"}
          validationCondition={formValidation.email}
          onBlur={onBlurValidateAllInput}
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          ref={passwordRef}
          inputValue={formData.password}
          setInputValue={(password) => onChangeFormData("password", password)}
          label="비밀번호"
          isEncryption={true}
          validationCondition={formValidation.password}
          onBlur={onBlurValidateAllInput}
        />
      </View>

      {LoginError && (
        <Text style={styles.errorText}>{LoginError?.message === "Unauthorized" ? "이메일 또는 비밀번호가 올바르지 않습니다." : LoginError?.message}</Text>
      )}

      <View style={styles.checkboxContainer}>
        <Checkbox
          innerText={"ID 저장"}
          isChecked={options.saveID}
          onCheck={setSaveID}
        />
        <Checkbox
          innerText={"자동 로그인"}
          isChecked={options.autoLogin}
          onCheck={setAutoLogin}
        />
      </View>
      <View style={styles.buttonContainer}>
        <LongButton
          color={"blue"}
          innerContent={
            isLoading ? (
              <ActivityIndicator color={"#FFF"} size={"small"} />
            ) : (
              "로그인"
            )
          }
          isAble={!isLoading}
          onPress={onLogin}
        />
      </View>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  inputContainer: {
    paddingHorizontal: 48,
  },
  errorText: {
    color: Color["red500"],
    fontFamily: "NanumSquareNeo-Bold",
    paddingVertical: 4,
    paddingHorizontal: 48+4,
    fontSize: 14,
  },
  checkboxContainer: {
    display: "flex",
    paddingHorizontal: 48,
    flexDirection: "row",
    justifyContent: "center",
    gap: 84,
  },
  buttonContainer: {
    marginHorizontal: 12,
  },
});
