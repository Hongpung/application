import { DescriptionBox } from "@hongpung/src/common";
import { EmailValidateForm } from "@hongpung/src/features/auth/resetPassword";
import { StepProps } from "@hongpung/react-step-flow";
import { View } from "react-native";
import { ResetPasswordStepsProps } from "@hongpung/src/features/auth/resetPassword/model/type";

type ValidateEmailSectionProps = StepProps<
  ResetPasswordStepsProps,
  "EmailConfirm"
>;

const ValidateEmailSection: React.FC<ValidateEmailSectionProps> = (props) => {
  const descriptions = [
    "로그인에 사용하는 이메일을 입력해주세요.",
    "이메일은 이메일 형식으로 입력해주세요.",
  ];

  return (
    <View style={{ flex: 1 }}>
      <DescriptionBox descriptions={descriptions} />
      <EmailValidateForm {...props} />
    </View>
  );
};

export default ValidateEmailSection;
