import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ReservationParamList } from "@hongpung/src/common/navigation";

import ReservationCalendarScreen from "@hongpung/src/pages/reservation/ReservationCalendarPage";
import DailyReserveListScreen from "@hongpung/src/pages/reservation/DailyReservationListPage";
import ReservationDetailScreen from "@hongpung/src/pages/reservation/ReservationDetailPage";

import { EditReservationNavigation } from "./EditReservationNavigation";
import { CreateReservationNavigation } from "./CreateReservationNavigation";

const ReservationStack = createNativeStackNavigator<ReservationParamList>();

export const ReservationStackNavigation = () => {
  return (
    <ReservationStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ReservationStack.Screen
        name="ReservationCalendar"
        component={ReservationCalendarScreen}
      />
      <ReservationStack.Screen
        name="DailyReserveList"
        component={DailyReserveListScreen}
      />
      <ReservationStack.Screen
        name="ReservationDetail"
        component={ReservationDetailScreen}
      />
      <ReservationStack.Screen
        name="EditReservation"
        component={EditReservationNavigation}
      />
      <ReservationStack.Screen
        name="CreateReservation"
        component={CreateReservationNavigation}
      />
    </ReservationStack.Navigator>
  );
};
