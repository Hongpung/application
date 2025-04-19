import { LongButton, ValidationState } from "@hongpung/src/common";
import { BasicInput } from "@hongpung/src/common/ui/inputs/InputBaseComponent";
import { TextInput, View } from "react-native";

interface SetPasswordFormProps {
  password?: string;
  setPassword: (text: string) => void;
  confirmPassword?: string;
  setConfirmPassword: (text: string) => void;

  passwordValidation: ValidationState;
  confirmPasswordValidation: ValidationState;

  validateConfirmPassword: (text: string) => void;
  validatePassword: (text: string) => void;

  passwordRef: React.RefObject<TextInput>;
  confirmPasswordRef: React.RefObject<TextInput>;

  nextStep: () => void;
}

export const SetPasswordForm: React.FC<SetPasswordFormProps> = (
  props
) => {
  const {
    passwordRef,
    password,
    setPassword,
    passwordValidation,
    validatePassword,

    confirmPasswordRef,
    confirmPassword,
    setConfirmPassword,
    confirmPasswordValidation,
    validateConfirmPassword,

    nextStep,
  } = props;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginHorizontal: 48 }}>
        <BasicInput
          ref={passwordRef}
          label="비밀번호"
          isEncryption
          inputValue={password||''}
          setInputValue={setPassword}
          validationCondition={passwordValidation}
          onBlur={() => {
            validatePassword(password||'');
          }}
        />
      </View>
      <View style={{ marginHorizontal: 48 }}>
        <BasicInput
          ref={confirmPasswordRef}
          label="비밀번호 확인"
          isEncryption
          inputValue={confirmPassword||''}
          setInputValue={setConfirmPassword}
          validationCondition={confirmPasswordValidation}
          onBlur={() => {
            validateConfirmPassword(confirmPassword||'');
          }}
        />
      </View>
      <View style={{ paddingHorizontal: 12, marginTop: 24 }}>
        <LongButton
          color={"green"}
          innerContent="다음"
          isAble={
            confirmPasswordValidation.state === "VALID" &&
            passwordValidation.state === "VALID"
          }
          onPress={nextStep}
        />
      </View>
    </View>
  );
};
