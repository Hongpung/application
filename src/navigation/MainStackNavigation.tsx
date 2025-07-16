import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  UseRoomState,
  useUserUseRoomFetch,
} from "@hongpung/src/entities/session";

import { MainStackParamList } from "@hongpung/src/common/navigation";
import {
  useLoadMyStatusFetch,
  UserStatusState,
} from "@hongpung/src/entities/member";

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
import { CheckOutScreen as CheckOutSessionScreen } from "@hongpung/src/pages/session/CheckOutPage";
import { UsingManageScreen as SessionManagementScreen } from "@hongpung/src/pages/session/UsingSessionManagePage";

import WebViewPage from "@hongpung/src/pages/webview/WebViewPage";

import { MainTabNavigation as MainTab } from "./MainTabNavigation";
import { ClubStackNavigation as ClubStack } from "./ClubStackNavigation";
import { ReservationStackNavigation as ReservationStack } from "./ReservationNavigation";
import { NoticeStackNavigation as NoticeStack } from "./NoticeStackNavigation";
import EditInstrumentPage from "@hongpung/src/pages/instrument/EditInstrumentPage";
import InstrumentCreateScreen from "@hongpung/src/pages/instrument/CreateInstrumentPage";
import WithdrawalScreen from "@hongpung/src/pages/auth/WithdrawalPage/WithdrawalPage";
import { SessionLogInfoPage } from "@hongpung/src/pages/session-log/SessionLogInfoPage";
import ChangeProfilePage from "@hongpung/src/pages/member/ChangeProfilePage";
import { BannerListPage } from "../pages/banner/BannerListPage";
import { useSyncQueryToAtom } from "../common/lib/useSyncQueryToAtom";

const MainStack = createNativeStackNavigator<MainStackParamList>();

export const MainStackNavigation = () => {
  const MyStatusQuery = useLoadMyStatusFetch();
  const isUseRoomQuery = useUserUseRoomFetch();

  useSyncQueryToAtom(MyStatusQuery, UserStatusState);
  useSyncQueryToAtom(isUseRoomQuery, UseRoomState);

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

      <MainStack.Screen name="Notification" component={NotificationPage} />

      <MainStack.Screen
        options={{ presentation: "formSheet" }}
        name="SessionManage"
        component={SessionManagementScreen}
      />
      <MainStack.Screen
        name="CheckOutSession"
        component={CheckOutSessionScreen}
        options={{
          gestureEnabled: false, // iOS에서 스와이프 back 비활성화
        }}
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

      <MainStack.Screen
        name="WebView"
        options={{ animation: "none" }}
        component={WebViewPage}
      />

      <MainStack.Screen
        name="InstrumentDetail"
        component={InstrumentDetailPage}
      />
      <MainStack.Screen name="EditInstrument" component={EditInstrumentPage} />
      <MainStack.Screen
        name="CreateInstrument"
        component={InstrumentCreateScreen}
      />

      <MainStack.Screen name="Notice" component={NoticeStack} />

      <MainStack.Screen name="Withdraw" component={WithdrawalScreen} />

      <MainStack.Screen name="SessionLogInfo" component={SessionLogInfoPage} />

      <MainStack.Screen
        name="ChangeProfile"
        component={ChangeProfilePage}
        options={{ gestureEnabled: false }}
      />

      <MainStack.Screen name="BannerList" component={BannerListPage} />
    </MainStack.Navigator>
  );
};
