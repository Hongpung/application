import { LongButton, ValidationState } from "@hongpung/src/common";
import { InputBaseComponent } from "@hongpung/src/common/ui/inputs/InputBaseComponent";
import { useRef, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { passwordSchema } from "../../model/passwordSchema";

export const ChangePasswordForm: React.FC<{
  currentPassword: string;
  setCurrentPassword: (text: string) => void;
  newPassword: string;
  setNewPassword: (text: string) => void;
  confirmPassword: string;
  setConfirmPassword: (text: string) => void;
  onChangePassword: () => Promise<void>;
}> = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onChangePassword,
}) => {
  const currentPasswordRef = useRef<any | null>(null);
  const newPasswordRef = useRef<any | null>(null);
  const confirmPasswordRef = useRef<any | null>(null);

  const validatePassword = (password: string): ValidationState => {
    const result = passwordSchema.safeParse(password);
    return result.success
      ? { state: "VALID" }
      : { state: "ERROR", errorText: result.error.errors[0].message };
  };

  const [curentPasswordValidation, setCurrentPasswordValidation] =
    useState<ValidationState>({ state: "BEFORE" });
  const [newPasswordValidation, setNewPasswordValidation] =
    useState<ValidationState>({ state: "BEFORE" });
  const [confirmPasswordValidation, setConfirmPasswordValidation] =
    useState<ValidationState>({ state: "BEFORE" });

  const handleChangePassword = async () => {
    const currentPasswordValidation = validatePassword(currentPassword);
    const newPasswordValidation = validatePassword(newPassword);
    const confirmPasswordValidation = validatePassword(confirmPassword);

    if (currentPasswordValidation.state === "ERROR") {
      currentPasswordRef.current?.focus();
      return;
    }

    if (newPasswordValidation.state === "ERROR") {
      newPasswordRef.current?.focus();
      return;
    }

    if (confirmPasswordValidation.state === "ERROR") {
      confirmPasswordRef.current?.focus();
      return;
    }

    if (newPassword !== confirmPassword) {
      confirmPasswordRef.current?.focus();
      Toast.show({ type: "error", text1: "비밀번호와 일치하지 않습니다." });
      return;
    }

    await onChangePassword();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginHorizontal: 48 }}>
        <InputBaseComponent
          ref={currentPasswordRef}
          label="현재 비밀번호"
          isEncryption
          inputValue={currentPassword}
          setInputValue={setCurrentPassword}
          validationCondition={curentPasswordValidation}
          onBlur={() => {
            setCurrentPasswordValidation(validatePassword(currentPassword));
          }}
        />
      </View>
      <View style={{ marginHorizontal: 48 }}>
        <InputBaseComponent
          ref={newPasswordRef}
          label="새로운 비밀번호"
          isEncryption
          inputValue={newPassword}
          setInputValue={setNewPassword}
          validationCondition={newPasswordValidation}
          onBlur={() => {
            setNewPasswordValidation(validatePassword(newPassword));
          }}
        />
      </View>
      <View style={{ marginHorizontal: 48 }}>
        <InputBaseComponent
          ref={confirmPasswordRef}
          label="새로운 비밀번호 확인"
          isEncryption
          inputValue={confirmPassword}
          setInputValue={setConfirmPassword}
          validationCondition={confirmPasswordValidation}
          onBlur={() => {
            setConfirmPasswordValidation(validatePassword(confirmPassword));
          }}
        />
      </View>
      <View style={{ paddingHorizontal: 12, marginTop: 24 }}>
        <LongButton
          color={"green"}
          innerContent="비밀번호 변경"
          isAble={
            curentPasswordValidation.state === "VALID" &&
            newPasswordValidation.state === "VALID" &&
            confirmPasswordValidation.state === "VALID"
          }
          onPress={handleChangePassword}
        />
      </View>
    </View>
  );
};
