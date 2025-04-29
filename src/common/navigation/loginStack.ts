import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type LoginStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
};

export type LoginStackScreenProps<T extends keyof LoginStackParamList> =
  NativeStackScreenProps<LoginStackParamList, T>;
