import { LongButton } from "@hongpung/src/common";
import { View } from "react-native";

interface SignUpNavigationButtonProps {
  navigateToSignUp: () => void;
}

const SignUpNavigationButton: React.FC<SignUpNavigationButtonProps> = ({
  navigateToSignUp,
}) => {
  return (
    <View style={{ paddingHorizontal: 12 }}>
      <LongButton
        innerContent="회원가입 하러 가기"
        color="green"
        onPress={navigateToSignUp}
      />
    </View>
  );
};

export default SignUpNavigationButton;
