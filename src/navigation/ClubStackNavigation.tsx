import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import ClubMainScreen from "@hongpung/src/pages/club/ClubMainPage";
import ClubInstrumentsScreen from "@hongpung/src/pages/club/ClubInstrumentListPage";
import ClubMembersScreen from "@hongpung/src/pages/club/ClubMemberListPage";
import ClubLogsScreen from "@hongpung/src/pages/club/ClubSessionLogPage";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { MainStackParamList } from "./MainStackNavigation";
// import ClubScheduleScreen from "@hongpung/src/pages/club/ClubSchedulePage"

export type ClubStackParamList = {
  ClubMain: undefined;
  ClubInstruments: undefined;
  ClubMembers: undefined;
  ClubLogs: undefined;
  ClubCalendar: undefined;
};

const ClubStack = createNativeStackNavigator<ClubStackParamList>();

type ClubStackNavigationProp<T extends keyof ClubStackParamList> =
  CompositeNavigationProp<
    NativeStackNavigationProp<ClubStackParamList, T>,
    NativeStackNavigationProp<MainStackParamList,"SessionManagement">
  >;

export type ClubStackProps<T extends keyof ClubStackParamList> = {
  navigation: ClubStackNavigationProp<T>;
  route: RouteProp<ClubStackParamList, T>;
};

export const ClubStackNavigation = () => {
  return (
    <ClubStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ClubStack.Screen name="ClubMain" component={ClubMainScreen} />
      <ClubStack.Screen
        name="ClubInstruments"
        component={ClubInstrumentsScreen}
      />
      <ClubStack.Screen name="ClubMembers" component={ClubMembersScreen} />
      <ClubStack.Screen name="ClubLogs" component={ClubLogsScreen} />
      {/* <ClubStack.Screen name="ClubCalendar" component={ClubCalendarScreen} /> */}
    </ClubStack.Navigator>
  );
};
