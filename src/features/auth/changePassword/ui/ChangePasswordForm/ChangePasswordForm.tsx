import React from "react";
import { LongButton, ValidationState } from "@hongpung/src/common";
import { BasicInput } from "@hongpung/src/common/ui/inputs/BasicInput";
import { TextInput, View } from "react-native";

interface PasswordValue {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type PasswordFormValidation = {
  [key in keyof PasswordValue]: ValidationState;
};

interface ChangePasswordFormProps {
  currentPassword: string;
  setCurrentPassword: (text: string) => void;
  newPassword: string;
  setNewPassword: (text: string) => void;
  confirmPassword: string;
  setConfirmPassword: (text: string) => void;
  onChangePassword: () => Promise<void>;
  passwordValidation: PasswordFormValidation;
  onCurrentPasswordBlur: () => void;
  onNewPasswordBlur: () => void;
  onConfirmPasswordBlur: () => void;
  currentPasswordRef: React.RefObject<TextInput>;
  newPasswordRef: React.RefObject<TextInput>;
  confirmPasswordRef: React.RefObject<TextInput>;
  isCanChangePassword: boolean;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = (
  props
) => {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    onChangePassword,
    passwordValidation,
    currentPasswordRef,
    newPasswordRef,
    confirmPasswordRef,
    onCurrentPasswordBlur,
    onNewPasswordBlur,
    onConfirmPasswordBlur,
    isCanChangePassword,
  } = props;

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 48, gap: 16 }}>
          <BasicInput
            ref={currentPasswordRef}
            label="현재 비밀번호"
            isEncryption
            color="green"
            inputValue={currentPassword}
            setInputValue={setCurrentPassword}
            validationCondition={passwordValidation.currentPassword}
            onBlur={onCurrentPasswordBlur}
          />
          <BasicInput
            ref={newPasswordRef}
            label="새로운 비밀번호"
            isEncryption
            color="green"
            inputValue={newPassword}
            setInputValue={setNewPassword}
            validationCondition={passwordValidation.newPassword}
            onBlur={onNewPasswordBlur}
          />
          <BasicInput
            ref={confirmPasswordRef}
            label="새로운 비밀번호 확인"
            isEncryption
            color="green"
            inputValue={confirmPassword}
            setInputValue={setConfirmPassword}
            validationCondition={passwordValidation.confirmPassword}
            onBlur={onConfirmPasswordBlur}
          />
        </View>
      </View>
      <View style={{ paddingHorizontal: 12, marginBottom: 16 }}>
        <LongButton
          color={"green"}
          innerContent="비밀번호 변경"
          isAble={isCanChangePassword}
          onPress={onChangePassword}
        />
      </View>
    </>
  );
};
