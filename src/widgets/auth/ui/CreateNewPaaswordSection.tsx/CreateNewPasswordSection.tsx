import useSignUpSteps from "@hongpung/src/features/auth/signUp/model/useSignUpSteps";
import { View } from "react-native";
import { DescriptionBox } from "@hongpung/src/common";
import { SetPasswordForm } from "@hongpung/src/features/auth/signUp/ui/SetPasswordForm/SetPasswordForm";

const CreateNewPasswordSection = () => {
  const useSignUp = useSignUpSteps();

  const descriptions = [
    "로그인에 사용할 비밀번호를 입력해주세요.",
    "비밀번호는 영문, 숫자, 특수문자를 포함한\n8~12자로 구성해야 해요.",
    "허용 특수문자: !,@,#,$,%,^,&,+,=",
  ];

  return (
  <View style={{ flex: 1 }}>
    <DescriptionBox descriptions={descriptions} />
    <SetPasswordForm {...useSignUp}/>
  </View>
  );
};

export default CreateNewPasswordSection;
