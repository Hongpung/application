import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { LoginStackParamList } from "./loginStack";
import { MainStackParamList } from "./mainStack";

export type RootStackParamList = {
  Tutorial: undefined;
  Permission: undefined;
  LoginStack: NavigatorScreenParams<LoginStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};
