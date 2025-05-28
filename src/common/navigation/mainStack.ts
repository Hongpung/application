import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ClubParamList } from "./clubStack";
import { MainTabParamList } from "./mainTab";
import { ReservationParamList } from "./reservationStack";
import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import { NoticeParamList } from "./noticeStack";

export type MainStackParamList = {
  MainTab: NavigatorScreenParams<MainTabParamList>;
  Notification: undefined;

  WebView: { url: string; title?: string };

  Club: NavigatorScreenParams<ClubParamList>;

  Reservation: NavigatorScreenParams<ReservationParamList>;
  CheckIn: undefined;

  SessionManage: undefined;
  CheckOutSession: undefined;

  UpComingReservation: undefined;
  MyLog: undefined;
  LoginSetting: undefined;
  NotificationSetting: undefined;

  ChangePassword: undefined;

  InstrumentDetail: { instrumentId: number };
  EditInstrument: { instrument: string };
  CreateInstrument: undefined;

  BorrowInstrumentList: { borrowInstruments: string };
  ParticipatorList: { participators: string };

  SessionLogInfo: { sessionId: number };
  Notice: NavigatorScreenParams<NoticeParamList>;
  Withdraw: undefined;

  ChangeProfile: undefined;

  BannerList: undefined;
};

export type MainStackNavigationProp =
  NativeStackNavigationProp<MainStackParamList>;

export type MainStackScreenProps<T extends keyof MainStackParamList> = {
  navigation: MainStackNavigationProp;
  route: RouteProp<MainStackParamList, T>;
};
