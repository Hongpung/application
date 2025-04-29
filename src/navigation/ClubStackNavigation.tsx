import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ClubParamList } from "@hongpung/src/common/navigation";

import ClubMainScreen from "@hongpung/src/pages/club/ClubMainPage";
import ClubInstrumentsScreen from "@hongpung/src/pages/club/ClubInstrumentListPage";
import ClubMembersScreen from "@hongpung/src/pages/club/ClubMemberListPage";
import ClubLogsScreen from "@hongpung/src/pages/club/ClubSessionLogPage";

const ClubStack = createNativeStackNavigator<ClubParamList>();

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
