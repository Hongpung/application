import { ActivityIndicator, StyleSheet, View, TextInput } from "react-native";
import React from "react";
import {
  Checkbox,
  Color,
  FieldReturn,
  Input,
  LongButton,
  ValidationState,
} from "@hongpung/src/common";
import { LoginFormData } from "../../model/LoginSchema";

interface LoginFormProps {
  emailRef: React.RefObject<TextInput | null>;
  passwordRef: React.RefObject<TextInput | null>;
  getField: <T extends keyof LoginFormData>(field: T) => FieldReturn<LoginFormData[T]>;

  onLogin: () => void;
  options: { saveID: boolean; autoLogin: boolean };
  setAutoLogin: (value: boolean) => void;
  setSaveID: (value: boolean) => void;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = (props) => {
  const {
    emailRef,

    passwordRef,
    getField,

    onLogin,
    options,
    setAutoLogin,
    setSaveID,
    isLoading,
  } = props;

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          ref={emailRef}
          label="이메일"
          keyboardType={"email-address"}
          {...getField("email")}
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          ref={passwordRef}
          label="비밀번호"
          isEncryption={true}
          {...getField("password")}
        />
      </View>

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
    paddingHorizontal: 48 + 4,
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
