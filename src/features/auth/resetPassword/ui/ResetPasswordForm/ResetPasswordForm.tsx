import { LongButton } from "@hongpung/src/common";
import { BasicInput } from "@hongpung/src/common/ui/inputs/BasicInput";
import { View } from "react-native";

import { ResetPasswordFormProps } from "../../model/type";

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = (props) => {
  const {
    newPasswordRef,
    newPassword,
    setNewPassword,
    newPasswordValidation,
    validateNewPassword,

    confirmPasswordRef,
    confirmPassword,
    setConfirmPassword,
    confirmPasswordValidation,
    validateConfirmPassword,
    resetPassword,
  } = props;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, gap: 24 }}>
        <View style={{ marginHorizontal: 48 }}>
          <BasicInput
            ref={newPasswordRef}
            label="비밀번호"
            isEncryption
            color="green"
            inputValue={newPassword || ""}
            setInputValue={setNewPassword}
            validationCondition={newPasswordValidation}
            onBlur={() => {
              validateNewPassword(newPassword || "");
            }}
          />
        </View>
        <View style={{ marginHorizontal: 48 }}>
          <BasicInput
            ref={confirmPasswordRef}
            label="비밀번호 확인"
            isEncryption
            color="green"
            inputValue={confirmPassword || ""}
            setInputValue={setConfirmPassword}
            validationCondition={confirmPasswordValidation}
            onBlur={() => {
              validateConfirmPassword(confirmPassword || "");
            }}
          />
        </View>
      </View>
      <View style={{ paddingHorizontal: 12 }}>
        <LongButton
          color={"green"}
          innerContent="비밀번호 재설정"
          isAble={
            confirmPasswordValidation.state === "VALID" &&
            newPasswordValidation.state === "VALID"
          }
          onPress={resetPassword}
        />
      </View>
    </View>
  );
};

export default ResetPasswordForm;
