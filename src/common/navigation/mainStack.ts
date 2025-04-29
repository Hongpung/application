import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ClubParamList } from "./clubStack";
import { MainTabParamList } from "./mainTab";
import { ReservationParamList } from "./reservationStack";
import { SessionManagementParamList } from "./sessionManageMent";
import { RouteProp } from "@react-navigation/native";

export type MainStackParamList = {
  MainTab: ScreenParams<MainTabParamList>;
  Notification: undefined;

  WebView: { url: string; title?: string };

  Club: ScreenParams<ClubParamList>;

  Reservation: ScreenParams<ReservationParamList>;
  CheckIn: undefined;
  SessionManagement: ScreenParams<SessionManagementParamList>;

  UpComingReservation: undefined;
  MyLog: undefined;
  LoginSetting: undefined;
  NotificationSetting: undefined;

  ChangePassword: undefined;

  InstrumentDetail: { instrumentId: number };
  BorrowInstrumentList: { borrowInstruments: string };
  ParticipatorList: { participators: string };
};

export type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export type MainStackScreenProps<T extends keyof MainStackParamList> = {
  navigation: MainStackNavigationProp;
  route: RouteProp<MainStackParamList, T>;
};
