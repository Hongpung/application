import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginStackParamList } from "@hongpung/src/common/navigation";

import LoginScreen from "@hongpung/src/pages/auth/LoginPage";
import SignUpScreen from "@hongpung/src/pages/auth/SignUpPage";
import ResetPasswordScreen from "@hongpung/src/pages/auth/ResetPasswordPage";

const LoginStack = createNativeStackNavigator<LoginStackParamList>();

export const LoginStackNavigation = () => {
  return (
    <LoginStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <LoginStack.Screen name="Login" component={LoginScreen} />
      <LoginStack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ gestureEnabled: false }}
      />
      <LoginStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </LoginStack.Navigator>
  );
};
