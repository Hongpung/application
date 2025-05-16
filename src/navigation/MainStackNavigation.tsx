import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useUserUseRoomFetch } from "@hongpung/src/entities/session";

import { MainStackParamList } from "@hongpung/src/common/navigation";
import { useLoadMyStatusFetch } from "@hongpung/src/entities/member";

import { LoginSettingPage } from "@hongpung/src/pages/setting/LoginSettingPage";
import NotificationSettingPage from "@hongpung/src/pages/setting/NotificationSettingPage";

import ChangePasswordPage from "@hongpung/src/pages/auth/ChangePasswordPage";
import NotificationPage from "@hongpung/src/pages/notification/NotificationPage";

import UpComingReservationPage from "@hongpung/src/pages/member/UpcommingSchedulePage";
import MyLogPage from "@hongpung/src/pages/member/MySessionLogPage";

import { BorrowInstrumentListPage } from "@hongpung/src/pages/reservation/BorrowInstrumentListPage";
import ParticipatorListViewPage from "@hongpung/src/pages/reservation/ParticipatorListViewPage";

import { InstrumentDetailPage } from "@hongpung/src/pages/instrument/InstrumentDetailPage";
import { CheckInPage } from "@hongpung/src/pages/session/CheckInPage";

import WebViewPage from "@hongpung/src/pages/webview/WebViewPage";

import { MainTabNavigation as MainTab } from "./MainTabNavigation";
import { ClubStackNavigation as ClubStack } from "./ClubStackNavigation";
import { ReservationStackNavigation as ReservationStack } from "./ReservationNavigation";
import { SessionManagementStackNavigation as SessionManagementStack } from "./SessionManagementStackNavigation";
import { NoticeStackNavigation as NoticeStack } from "./NoticeStackNavigation";

const MainStack = createNativeStackNavigator<MainStackParamList>();

export const MainStackNavigation = () => {
  useLoadMyStatusFetch();
  useUserUseRoomFetch();

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen
        name="MainTab"
        component={MainTab}
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
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
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
        component={BorrowInstrumentListPage}
      />

      <MainStack.Screen
        name="ParticipatorList"
        component={ParticipatorListViewPage}
      />

      <MainStack.Screen name="WebView" component={WebViewPage} />

      <MainStack.Screen
        name="InstrumentDetail"
        component={InstrumentDetailPage}
      />

      <MainStack.Screen name="Notice" component={NoticeStack} />
    </MainStack.Navigator>
  );
};
