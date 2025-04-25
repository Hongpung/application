import LoginScreen from "@hongpung/src/pages/auth/LoginPage";
import SignUpScreen from "@hongpung/src/pages/auth/SignUpPage";
import ResetPasswordScreen from "@hongpung/src/pages/auth/ResetPasswordPage";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";

export type LoginStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
};

export type LoginStackScreenProps<T extends keyof LoginStackParamList> =
  NativeStackScreenProps<LoginStackParamList, T>;

const LoginStack = createNativeStackNavigator<LoginStackParamList>();

export const LoginStackNavigation = () => {
  return (
    <LoginStack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <LoginStack.Screen name="Login" component={LoginScreen} />
      <LoginStack.Screen name="SignUp" component={SignUpScreen} />
      <LoginStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </LoginStack.Navigator>
  );
};
