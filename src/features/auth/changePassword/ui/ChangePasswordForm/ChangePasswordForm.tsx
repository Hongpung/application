import { LongButton, ValidationState } from "@hongpung/src/common";
import { BasicInput } from "@hongpung/src/common/ui/inputs/InputBaseComponent";
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
  validateConfirmPassword: (text: PasswordValue["confirmPassword"]) => ValidationState;
  validateNewPassword: (text: PasswordValue["newPassword"]) => ValidationState;
  validateCurrentPassword: (text: PasswordValue["currentPassword"]) => ValidationState;
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
    validateConfirmPassword,
    validateNewPassword,
    validateCurrentPassword,
    isCanChangePassword,
  } = props;
  
  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginHorizontal: 48 }}>
        <BasicInput
          ref={currentPasswordRef}
          label="현재 비밀번호"
          isEncryption
          inputValue={currentPassword}
          setInputValue={setCurrentPassword}
          validationCondition={passwordValidation.currentPassword}
          onBlur={() => {
            validateCurrentPassword(currentPassword)
          }}
        />
      </View>
      <View style={{ marginHorizontal: 48 }}>
        <BasicInput
          ref={newPasswordRef}
          label="새로운 비밀번호"
          isEncryption
          inputValue={newPassword}
          setInputValue={setNewPassword}
          validationCondition={passwordValidation.newPassword}
          onBlur={() => {
            validateNewPassword(newPassword);
          }}
        />
      </View>
      <View style={{ marginHorizontal: 48 }}>
        <BasicInput
          ref={confirmPasswordRef}
          label="새로운 비밀번호 확인"
          isEncryption
          inputValue={confirmPassword}
          setInputValue={setConfirmPassword}
          validationCondition={passwordValidation.confirmPassword}
          onBlur={() => {
            validateConfirmPassword(confirmPassword);
          }}
        />
      </View>
      <View style={{ paddingHorizontal: 12, marginTop: 24 }}>
        <LongButton
          color={"green"}
          innerContent="비밀번호 변경"
          isAble={isCanChangePassword}
          onPress={onChangePassword}
        />
      </View>
    </View>
  );
};
