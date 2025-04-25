import HomeScreen from "@hongpung/src/pages/home/HomePage";
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { MainStackParamList } from "./MainStackNavigation";
import MyPageScreen from "@hongpung/src/pages/member/MyPagePage";
import QRCodeScreen from "@hongpung/src/pages/session/QRScanPage";
import ReservationScreen from "@hongpung/src/pages/reservation/ReservationMainPage";
import { Icons } from "../common";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type MainTabParamList = {
  Home: undefined;
  QRCode: undefined;
  Reservation: undefined;
  MyPage: undefined;
};

type MainTabStackNavigation = NativeStackNavigationProp<
  MainStackParamList,
  "MainTab"
>;
type MainTabNavigation<T extends keyof MainTabParamList> =
  BottomTabNavigationProp<MainTabParamList, T>;
type MainTabRouteProps<T extends keyof MainTabParamList> = RouteProp<
  MainTabParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = {
  navigation: MainTabNavigation<T> & MainTabStackNavigation;
  route: MainTabRouteProps<T>;
};

const MainTab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigation: React.FC = () => {
  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
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
