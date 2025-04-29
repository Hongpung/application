import { LongButton } from "@hongpung/src/common";
import { BasicInput } from "@hongpung/src/common/ui/inputs/BasicInput";
import { View } from "react-native";

import { SetPasswordFormProps } from "../../model/type";

export const SetPasswordForm: React.FC<SetPasswordFormProps> = (props) => {
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
      <View style={{ flex: 1, gap: 24 }}>
        <View style={{ marginHorizontal: 48 }}>
          <BasicInput
            ref={passwordRef}
            label="비밀번호"
            isEncryption
            color="green"
            inputValue={password || ""}
            setInputValue={setPassword}
            validationCondition={passwordValidation}
            onBlur={() => {
              validatePassword(password || "");
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
          innerContent="비밀번호 설정 완료"
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
