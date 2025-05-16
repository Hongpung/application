import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ClubParamList } from "./clubStack";
import { MainTabParamList } from "./mainTab";
import { ReservationParamList } from "./reservationStack";
import { SessionManagementParamList } from "./sessionManageMent";
import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import { NoticeParamList } from "./noticeStack";

export type MainStackParamList = {
  MainTab: NavigatorScreenParams<MainTabParamList>;
  Notification: undefined;

  WebView: { url: string; title?: string };

  Club: NavigatorScreenParams<ClubParamList>;

  Reservation: NavigatorScreenParams<ReservationParamList>;
  CheckIn: undefined;
  SessionManagement: NavigatorScreenParams<SessionManagementParamList>;

  UpComingReservation: undefined;
  MyLog: undefined;
  LoginSetting: undefined;
  NotificationSetting: undefined;

  ChangePassword: undefined;

  InstrumentDetail: { instrumentId: number };
  BorrowInstrumentList: { borrowInstruments: string };
  ParticipatorList: { participators: string };

  Notice: NavigatorScreenParams<NoticeParamList>;
};

export type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export type MainStackScreenProps<T extends keyof MainStackParamList> = {
  navigation: MainStackNavigationProp;
  route: RouteProp<MainStackParamList, T>;
};
