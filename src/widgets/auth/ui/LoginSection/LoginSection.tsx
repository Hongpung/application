import { useLoginForm } from "@hongpung/src/features/auth/login/model/useLoginForm";
import LoginForm from "@hongpung/src/features/auth/login/ui/LoginForm/LoginForm";

const LoginSection: React.FC = () => {
  const form = useLoginForm();

  return <LoginForm {...form} />;
};

export default LoginSection;
