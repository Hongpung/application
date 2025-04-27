import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { MainTabNavigation, MainTabParamList } from "./MainTabNavigation";
import LoginSettingPage from "@hongpung/src/pages/setting/LoginSettingPage";
import NotificationSettingPage from "@hongpung/src/pages/setting/NotificationSettingPage";
import UpComingReservationPage from "@hongpung/src/pages/member/UpcommingSchedulePage";
import MyLogPage from "@hongpung/src/pages/member/MySessionLogPage";
import CheckInPage from "@hongpung/src/pages/session/CheckInPage";
import {
  ClubStackNavigation as ClubStack,
  ClubStackParamList,
} from "./ClubStackNavigation";
import {
  ReservationStackNavigation as ReservationStack,
  ReservationStackParamList,
} from "./ReservationNavigation";
import {
  SessionManagementStackNavigation as SessionManagementStack,
  SessionManagementStackParamList,
} from "./SessionManagementStackNavigation";
import ChangePasswordPage from "@hongpung/src/pages/auth/ChangePasswordPage";
import NotificationPage from "@hongpung/src/pages/notification/NotificationPage";
import { useLoadMyStatusFetch } from "@hongpung/src/entities/member";
import ReservationInstrumentsViewScreen from "../pages/reservation/BorrowInstrumentListViewPage";
import ParticipatorListViewPage from "../pages/reservation/ParticipatorListViewPage";

export type MainStackParamList = {
  MainTab: ScreenParams<MainTabParamList>;
  Notification: undefined;

  WebView: { url: string; title?: string };

  Club: ScreenParams<ClubStackParamList>;

  Reservation: ScreenParams<ReservationStackParamList>;
  CheckIn: undefined;
  SessionManagement: ScreenParams<SessionManagementStackParamList>;

  UpComingReservation: undefined;
  MyLog: undefined;
  LoginSetting: undefined;
  NotificationSetting: undefined;

  ChangePassword: undefined;

  BorrowInstrumentList: { borrowInstruments: string };
  ParticipatorList: { participators: string };
};

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

const MainStack = createNativeStackNavigator<MainStackParamList>();

export const MainStackNavigation = () => {
  const {} = useLoadMyStatusFetch();
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen
        name="MainTab"
        component={MainTabNavigation}
        options={{
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name="Notification"
        component={NotificationPage}
        options={{ presentation: "modal" }}
      />
      <MainStack.Screen
        name="SessionManagement"
        component={SessionManagementStack}
      />

      <MainStack.Screen name="Club" component={ClubStack} />
      <MainStack.Screen name="Reservation" component={ReservationStack} />
      <MainStack.Screen name="CheckIn" component={CheckInPage} />

      <MainStack.Screen name="LoginSetting" component={LoginSettingPage} />
      <MainStack.Screen
        name="NotificationSetting"
        component={NotificationSettingPage}
      />
      <MainStack.Screen
        name="UpComingReservation"
        component={UpComingReservationPage}
      />
      <MainStack.Screen name="MyLog" component={MyLogPage} />

      <MainStack.Screen name="ChangePassword" component={ChangePasswordPage} />

      <MainStack.Screen
        name="BorrowInstrumentList"
        component={ReservationInstrumentsViewScreen}
      />

      <MainStack.Screen
        name="ParticipatorList"
        component={ParticipatorListViewPage}
      />

      {/* <MainStack.Screen name="WebView" component={WebViewPage} /> */}
      
    </MainStack.Navigator>
  );
};
