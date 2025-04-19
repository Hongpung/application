import { DescriptionBox } from "@hongpung/src/common";
import { useChangePassword } from "@hongpung/src/features/auth/changePassword/model/useChangePassword";
import { ChangePasswordForm } from "@hongpung/src/features/auth/changePassword/ui/ChangePasswordForm/ChangePasswordForm";
import { View } from "react-native";

export const ChangePasswordSection: React.FC = () => {
    
  const form = useChangePassword();

  const descriptions = [
    "비밀번호를 입력해주세요.",
    "비밀번호는 영문, 숫자, 특수문자를 포함한\n8~12자로 구성해야 해요.",
    "허용 특수문자: !,@,#,$,%,^,&,+,=",
  ];

  return (
    <View style={{flex: 1}}>
      <DescriptionBox descriptions={descriptions} />
      <ChangePasswordForm {...form} />
    </View>
  );
};
