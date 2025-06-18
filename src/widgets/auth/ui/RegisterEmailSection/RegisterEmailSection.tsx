import { DescriptionBox } from "@hongpung/src/common";
import { SignUpStepPropsList } from "@hongpung/src/features/auth/signUp/model/type";
import { EmailValidateForm } from "@hongpung/src/features/auth/signUp/ui/EmailValidateForm/EmailValidateForm";
import { StepProps } from "@hongpung/react-step-flow";
import { View } from "react-native";

type RegisterEmailSectionProps = StepProps<SignUpStepPropsList, "EmailConfirm">;

const RegisterEmailSection: React.FC<RegisterEmailSectionProps> = (props) => {
  const descriptions = [
    "이메일을 입력해주세요.",
    "이메일은 이메일 형식으로 입력해주세요.",
  ];

  return (
    <View style={{ flex: 1 }}>
      <DescriptionBox descriptions={descriptions} />
      <EmailValidateForm {...props} />
    </View>
  );
};

export default RegisterEmailSection;
