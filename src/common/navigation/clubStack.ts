import { RouteProp } from "@react-navigation/native";
import { MainStackNavigationProp } from "./mainStack";

export type ClubParamList = {
  ClubMain: undefined;
  ClubInstruments: undefined;
  ClubMembers: undefined;
  ClubLogs: undefined;
  ClubCalendar: undefined;
};

export type ClubStackProps<T extends keyof ClubParamList> = {
  navigation: MainStackNavigationProp;
  route: RouteProp<ClubParamList, T>;
};
