import { useChangePasswordForm } from "@hongpung/src/features/auth/changePassword/model/useChangePassword";
import { ChangePasswordForm } from "@hongpung/src/features/auth/changePassword/ui/ChangePasswordForm/ChangePasswordForm";
import { View } from "react-native";

export const ChangePasswordSection: React.FC = () => {
    
  const form = useChangePasswordForm();

  return (
    <View style={{flex: 1}}>
      <ChangePasswordForm {...form} />
    </View>
  );
};
