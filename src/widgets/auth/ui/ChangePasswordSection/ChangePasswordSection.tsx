import { DescriptionBox } from "@hongpung/src/common";
import { useChangePassword } from "@hongpung/src/features/auth/changePassword/model/useChangePassword";
import { ChangePasswordForm } from "@hongpung/src/features/auth/changePassword/ui/ChangePasswordForm/ChangePasswordForm";
import { View } from "react-native";

export const ChangePasswordSection: React.FC = () => {
    
  const form = useChangePassword();

  return (
    <View style={{flex: 1}}>
      <ChangePasswordForm {...form} />
    </View>
  );
};
