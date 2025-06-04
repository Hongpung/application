import { View } from "react-native";

import { LongButton, BasicInput } from "@hongpung/src/common";

import { SignUpStepPropsList } from "../../model/type";
import { StepProps } from "@hongpung/react-step-flow";

type SetPasswordFormProps = StepProps<SignUpStepPropsList, "SetPassword">;

export const SetPasswordForm: React.FC<SetPasswordFormProps> = ({
  stepProps: props,
  goTo,
}) => {
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
  } = props;

  const nextStep = () => {
    if (
      confirmPasswordValidation.state === "VALID" &&
      passwordValidation.state === "VALID"
    ) {
      goTo("PersonalInfo");
    }
  };

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
            onBlur={validatePassword}
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
            onBlur={validateConfirmPassword}
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

export default SetPasswordForm;
