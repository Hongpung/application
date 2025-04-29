import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { MainStackNavigationProp } from "./mainStack";

export type MainTabParamList = {
  Home: undefined;
  QRCode: undefined;
  Reservation: undefined;
  MyPage: undefined;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> = {
  navigation: BottomTabNavigationProp<MainTabParamList, T> &
    MainStackNavigationProp;
  route: RouteProp<MainTabParamList, T>;
};
