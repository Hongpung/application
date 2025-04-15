import { LongButton } from "@hongpung/src/common";
import { useNavigation } from "@react-navigation/native";

interface SignUpNavigationButtonProps {
  navigateToSignUp: () => void;
}

const SignUpNavigationButton: React.FC<SignUpNavigationButtonProps> = ({
  navigateToSignUp,
}) => {
  return (
    <LongButton
      innerContent="회원가입 하러 가기"
      color="green"
      onPress={navigateToSignUp}
    />
  );
};

export default SignUpNavigationButton;
