import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { MainTabParamList } from "@hongpung/src/common/navigation";
import { Color, Icons } from "@hongpung/src/common";

import HomeScreen from "@hongpung/src/pages/home/HomePage";
import MyPageScreen from "@hongpung/src/pages/member/MyPagePage";
import QRCodeScreen from "@hongpung/src/pages/session/QRScanPage";
import ReservationScreen from "@hongpung/src/pages/reservation/ReservationMainPage";

const MainTab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigation: React.FC = () => {
  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Color["blue500"],
        tabBarInactiveTintColor: Color["grey300"],
        tabBarStyle: {
          height: 72,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderTopColor: Color["grey100"],
          borderLeftColor: Color["grey100"],
          borderRightColor: Color["grey100"],
          backgroundColor: "#FFF",
          position: "absolute",
        },
        headerShown: false,
        tabBarIconStyle: {
          width: 36,
          height: 36,
          marginTop: 8,
          marginBottom: 2,
        },
        tabBarLabelStyle: { fontFamily: "NanumSquareNeo-Bold", fontSize: 12 },
      }}
    >
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icons name={focused ? "home" : "home-outline"} color={color} />
          ),
          tabBarLabel: "홈",
        }}
      />
      <MainTab.Screen
        name="Reservation"
        component={ReservationScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icons
              name={focused ? "calendar" : "calendar-outline"}
              color={color}
            />
          ),
          tabBarLabel: "예약",
        }}
      />
      <MainTab.Screen
        name="QRCode"
        component={QRCodeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icons name={"qr-code-sharp"} color={color} />
          ),
          tabBarLabel: "QR 스캔",
          tabBarStyle: { display: "none" },
          unmountOnBlur: true,
        }}
      />
      <MainTab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarIcon: ({ color }) => <Icons name={"person"} color={color} />,
          tabBarLabel: "내 정보",
        }}
      />
    </MainTab.Navigator>
  );
};

export default MainTabNavigation;
