import { ReservationProvider } from "@hongpung/pages/Reservation/context/ReservationContext";
import DailyReservationListScreen from "@hongpung/pages/Reservation/DailyReservationListScreen";
import BorrowInstrumentSelectScreen from "@hongpung/pages/Reservation/InReservation/BorrowInstrumentSelectScreen";
import DateSelcectScreen from "@hongpung/pages/Reservation/InReservation/DateSelcectScreen";
import ParticipantsSelectScreen from "@hongpung/pages/Reservation/InReservation/ParticipantsSelectScreen";
import ReservationConfirmScreen from "@hongpung/pages/Reservation/InReservation/ReservationConfirmScreen";
import ReservationEditConfirmScreen from "@hongpung/pages/Reservation/InReservation/ReservationEditConfirm";
import ReservationScreen from "@hongpung/pages/Reservation/InReservation/ReservationScreen";
import TimeSelectScreen from "@hongpung/pages/Reservation/InReservation/TimeSelectScreen";
import ReservationCalendarScreen from "@hongpung/pages/Reservation/ReservationCalendarScreen";
import ReservationDetailScreen from "@hongpung/pages/Reservation/ViewDetailReservation/ReservationDetailScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Header } from "@hongpung/src/common";
import { ScreenParams } from "./HomeStacks";
import ReservationParticipatorsViewScreen from "@hongpung/pages/Reservation/ViewDetailReservation/ReservationParticipatorsViewScreen";
import ReservationInstrumentsViewScreen from "@hongpung/pages/Reservation/ViewDetailReservation/ReservationInstrumentsViewScreen";



export type InReservationStackParamList = {
    inReservation?: { reservationId: number | null, date: string };

    ResrvationDateSelect: undefined;
    TimeSelect: undefined;
    BorrowInstrumentSelect: undefined;

    ParticipantsSelect: undefined;
    ReservationConfirm: undefined;
    ReservationEditConfirm: undefined;
};

const InReservationStack = createNativeStackNavigator<InReservationStackParamList>();

const InReservationStacks = () => {
    return (
        <ReservationProvider>
            <InReservationStack.Navigator initialRouteName='inReservation' screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
                <InReservationStack.Screen
                    name='inReservation'
                    component={ReservationScreen}
                    options={{
                        animation: 'none',
                        headerShown: true,
                        header: () => <Header leftButton='close' headerName='연습실 예약' />
                    }}
                />
                <InReservationStack.Screen
                    name='ResrvationDateSelect'
                    component={DateSelcectScreen}
                    options={{
                        headerShown: true,
                        animation: 'none',
                        header: ({ navigation }) => <Header leftButton='close' headerName='예약 일시 선택' LeftAction={() => navigation.navigate('inReservation')} />
                    }}
                />
                <InReservationStack.Screen
                    name='TimeSelect'
                    component={TimeSelectScreen}
                    options={{
                        animation: 'none',
                    }}
                />
                <InReservationStack.Screen
                    name='BorrowInstrumentSelect'
                    component={BorrowInstrumentSelectScreen}
                    options={{
                        animationDuration: 100,
                    }}
                />

                <InReservationStack.Screen
                    name='ParticipantsSelect'
                    component={ParticipantsSelectScreen}
                    options={{
                        animationDuration: 100,
                    }}
                />

                <InReservationStack.Screen
                    name='ReservationConfirm'
                    component={ReservationConfirmScreen}
                    options={{
                        animation: 'none'
                    }}
                />
                <InReservationStack.Screen
                    name='ReservationEditConfirm'
                    component={ReservationEditConfirmScreen}
                    options={{
                        animation: 'none'
                    }}
                />

            </InReservationStack.Navigator>
        </ReservationProvider>
    )
}



export type ReservationStackParamList = {
    ReserveCalendar?: { date?: string };
    DailyReserveList: { date: string }
    ReservationDetail: { reservationId: number }

    ReservationStack?: ScreenParams<InReservationStackParamList>;
    ReservationParticipatorsView: { participators: string }//User[]
    ReservationInstrumentsView: { instruments: string }//User[]
};

const ReservationStack = createNativeStackNavigator<ReservationStackParamList>();


const ReservationStacks = () => {
    return (
        <ReservationStack.Navigator initialRouteName="ReserveCalendar" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <ReservationStack.Screen
                name='ReserveCalendar'
                component={ReservationCalendarScreen}
                options={{
                    headerShown: true,
                    header: ({ navigation }) => <Header leftButton='close' headerName='연습실 예약 조회' RightButton='예약'
                        rightAction={() => {
                            navigation.push('ReservationStack')
                        }}
                    />
                }}
            />
            <ReservationStack.Screen
                name='DailyReserveList'
                component={DailyReservationListScreen}
                options={{
                    animation: 'none',
                }}

            />

            <ReservationStack.Screen
                name='ReservationParticipatorsView'
                component={ReservationParticipatorsViewScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='close' headerName='참여 인원' />
                }}

            />

            <ReservationStack.Screen
                name='ReservationInstrumentsView'
                component={ReservationInstrumentsViewScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='close' headerName='대여 악기' />
                }}

            />


            <ReservationStack.Screen
                name='ReservationDetail'
                component={ReservationDetailScreen}
                options={{
                    animation: 'none',
                    headerShown: true,
                    header: () => <Header leftButton='close' headerName='예약 조회' />
                }}
            />

            <ReservationStack.Screen
                name='ReservationStack'
                component={InReservationStacks}
            />
        </ReservationStack.Navigator>
    );
};

export default ReservationStacks;