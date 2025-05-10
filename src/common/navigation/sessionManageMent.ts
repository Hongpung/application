import { MainStackNavigationProp } from "./mainStack";
import { RouteProp } from "@react-navigation/native";

export type SessionManagementParamList = {
  SessionManage: undefined;
  CheckOutSession: undefined;
};

export type SessionManagementScreenProps<
  T extends keyof SessionManagementParamList
> = {
  navigation: MainStackNavigationProp;
  route: RouteProp<SessionManagementParamList, T>;
};