import { DescriptionBox, FieldReturn } from "@hongpung/src/common";
import { PasswordFormData } from "@hongpung/src/features/auth/changePassword/model/changePasswordSchema";
import { ChangePasswordForm } from "@hongpung/src/features/auth/changePassword/ui/ChangePasswordForm/ChangePasswordForm";
import { ScrollView, TextInput, View } from "react-native";

interface ChangePasswordSectionProps {
  getField: (fieldName: keyof PasswordFormData) => FieldReturn<PasswordFormData[keyof PasswordFormData]>;
  onChangePassword: (
  ) => Promise<void>;
  currentPasswordRef: React.RefObject<TextInput | null>;
  newPasswordRef: React.RefObject<TextInput | null>;
  confirmPasswordRef: React.RefObject<TextInput | null>;
  isCanChangePassword: boolean;
}

export const ChangePasswordSection: React.FC<ChangePasswordSectionProps> = (props) => {
  const descriptions = [
    "현재 로그인에 사용중인 비밀번호를 입력해주세요.",
    "",
    "새로운 비밀번호는 영문, 숫자, 특수문자를 포함한",
    "8~12자로 구성해야 해요.",
    "허용 특수문자: !,@,#,$,%,^,&,+,=",
  ];

  return (
    <View style={{ flex: 1, gap: 16 }}>
      <DescriptionBox descriptions={descriptions} />
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        contentContainerStyle={{ flexGrow: 1, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <ChangePasswordForm {...props} />
      </ScrollView>
    </View>
  );
};
