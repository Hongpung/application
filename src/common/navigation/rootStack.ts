import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp, } from "@react-navigation/native-stack";

import { LoginStackParamList } from "./loginStack";
import { MainStackParamList } from "./mainStack";

export type RootStackParamList = {
  Tutorial: undefined;
  Permission: undefined;
  LoginStack: ScreenParams<LoginStackParamList>;
  Main: ScreenParams<MainStackParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};
