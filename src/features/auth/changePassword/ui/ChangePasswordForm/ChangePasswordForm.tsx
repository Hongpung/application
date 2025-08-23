import React from "react";
import { FieldReturn, LongButton, ValidationState } from "@hongpung/src/common";
import { BasicInput } from "@hongpung/src/common/ui/inputs/BasicInput";
import { TextInput, View } from "react-native";
import { PasswordFormData } from "../../model/changePasswordSchema";

interface PasswordValue {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type PasswordFormValidation = {
  [key in keyof PasswordValue]: ValidationState;
};

interface ChangePasswordFormProps {
  getField: (fieldName: keyof PasswordFormData) => FieldReturn<PasswordFormData[keyof PasswordFormData]>;
  onChangePassword: () => Promise<void>;

  currentPasswordRef: React.RefObject<TextInput | null>;
  newPasswordRef: React.RefObject<TextInput | null>;
  confirmPasswordRef: React.RefObject<TextInput | null>;
  isCanChangePassword: boolean;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = (
  props,
) => {
  const {
    getField,
    onChangePassword,
    currentPasswordRef,
    newPasswordRef,
    confirmPasswordRef,
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
            {...getField("currentPassword")}
          />
          <BasicInput
            ref={newPasswordRef}
            label="새로운 비밀번호"
            isEncryption
            color="green"
            {...getField("newPassword")}
          />
          <BasicInput
            ref={confirmPasswordRef}
            label="새로운 비밀번호 확인"
            isEncryption
            color="green"
            {...getField("confirmPassword")}
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
