import { DescriptionBox } from "@hongpung/src/common";
import useSignUpSteps from "@hongpung/src/features/auth/signUp/model/useSignUpSteps";
import EmailValidateForm from "@hongpung/src/features/auth/signUp/ui/EmailValidateForm/EmailValidateForm";
import { View } from "react-native";

const RegisterEmailSection = () => {
  const useSignUp = useSignUpSteps();

  const descriptions = [
    "이메일을 입력해주세요.",
    "이메일은 이메일 형식으로 입력해주세요.",
  ];

  return (
    <View>
      <DescriptionBox descriptions={descriptions} />
      <EmailValidateForm {...useSignUp} />
    </View>
  );
};

export default RegisterEmailSection;
