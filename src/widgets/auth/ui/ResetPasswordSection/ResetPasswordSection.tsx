import { DescriptionBox } from "@hongpung/src/common";
import { ResetPasswordForm } from "@hongpung/src/features/auth/resetPassword";
import { ResetPasswordStepsProps } from "@hongpung/src/features/auth/resetPassword/model/type";
import { StepProps } from "@hongpung/react-step-flow";
import { View } from "react-native";

type ResetPasswordSectionProps = StepProps<
  ResetPasswordStepsProps,
  "ResetPassword"
>;

const ResetPasswordSection: React.FC<ResetPasswordSectionProps> = (props) => {
  const descriptions = [
    "로그인에 사용할 새로운 비밀번호를 입력해주세요.",
    "비밀번호는 영문, 숫자, 특수문자를 포함한\n8~12자로 구성해야 해요.",
    "허용 특수문자: !,@,#,$,%,^,&,+,=",
  ];

  return (
    <View style={{ flex: 1 }}>
      <DescriptionBox descriptions={descriptions} />
      <ResetPasswordForm {...props} />
    </View>
  );
};

export default ResetPasswordSection;
