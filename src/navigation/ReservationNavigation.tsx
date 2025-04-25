import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import ReservationCalendarScreen from "@hongpung/src/pages/reservation/ReservationCalendarPage";
import DailyReserveListScreen from "@hongpung/src/pages/reservation/DailyReservationListPage";
import ReservationDetailScreen from "@hongpung/src/pages/reservation/ReservationDetailPage";


const ReservationStack = createNativeStackNavigator<ReservationStackParamList>();

export type ReservationStackParamList = {
    ReservationCalendar: undefined;
    DailyReserveList: { date: string };
    ReservationDetail: { reservationId: number };
}

export type ReservationStackScreenProps<T extends keyof ReservationStackParamList> = NativeStackScreenProps<ReservationStackParamList, T>;

export const ReservationStackNavigation = () => {
    return (
        <ReservationStack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <ReservationStack.Screen name="ReservationCalendar" component={ReservationCalendarScreen} />
            <ReservationStack.Screen name="DailyReserveList" component={DailyReserveListScreen} />
            <ReservationStack.Screen name="ReservationDetail" component={ReservationDetailScreen} />
        </ReservationStack.Navigator>
    )
}


