import { View } from "react-native";

import { LongButton, BasicInput, Alert } from "@hongpung/src/common";

import { SignUpStepPropsList } from "../../model/type";
import { StepProps } from "@hongpung/react-step-flow";

type SetPasswordFormProps = StepProps<SignUpStepPropsList, "SetPassword">;

export const SetPasswordForm: React.FC<SetPasswordFormProps> = ({
  stepProps: props,
  goTo,
}) => {
  const {
    passwordRef,
    confirmPasswordRef,
    getField,
    validateNewPassword,
    isCanSetPassword,
  } = props;

  const nextStep = () => {
    validateNewPassword({
      onSuccess: () => {
        goTo("PersonalInfo");
      },
      onError: () => {
        Alert.alert("오류", "비밀번호 설정에 실패했어요");
      },
    });
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
            {...getField("password")}
          />
        </View>
        <View style={{ marginHorizontal: 48 }}>
          <BasicInput
            ref={confirmPasswordRef}
            label="비밀번호 확인"
            isEncryption
            color="green"
            {...getField("confirmPassword")}
          />
        </View>
      </View>
      <View style={{ paddingHorizontal: 12 }}>
        <LongButton
          color={"green"}
          innerContent="비밀번호 설정 완료"
          isAble={isCanSetPassword}
          onPress={nextStep}
        />
      </View>
    </View>
  );
};

export default SetPasswordForm;
