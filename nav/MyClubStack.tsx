import { createNativeStackNavigator } from "@react-navigation/native-stack";

import InstrumentStacks, { ClubInstrumentStackParamList } from "./InstrumentStack";
import { ScreenParams } from "./HomeStacks";

import Header from "@hongpung/src/common/components/header/Header";

import MyClubScreen from "@hongpung/pages/Home/MyClub/MyClubScreen";

import ClubMemeberScreen from "@hongpung/pages/Home/MyClub/ClubMember/ClubMemeberScreen";
import ClubPracticeCalendarScreen from "@hongpung/pages/Home/MyClub/ClubCalendar/ClubPracticeCalendarScreen";

import PracticeInfoScreen from "@hongpung/pages/share/ClubPracticeInfoScreen";


export type MyClubStackStackParamList = {
    MyClubHome: undefined;
    ClubMembers: undefined;
    Instruments: ScreenParams<ClubInstrumentStackParamList>
    ClubCalendar: undefined;
    MyClubPracticeInfo: { reservationId: number };
};



const MyClubStack = createNativeStackNavigator<MyClubStackStackParamList>();

const MyClubStacks = () => {
    return (
        <MyClubStack.Navigator initialRouteName="MyClubHome" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <MyClubStack.Screen
                name="MyClubHome"
                component={MyClubScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='arrow-back' HeaderName='우리 동아리' />
                }}
            />

            <MyClubStack.Screen
                name="ClubMembers"
                component={ClubMemeberScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='arrow-back' HeaderName='동아리원' />
                }}
            />

            <MyClubStack.Screen
                name="Instruments"
                component={InstrumentStacks}
            />

            <MyClubStack.Screen
                name='MyClubPracticeInfo'
                component={PracticeInfoScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='연습 기록' />
                }}
            />
            <MyClubStack.Screen
                name='ClubCalendar'
                component={ClubPracticeCalendarScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='연습 기록 보기' />
                }}
            />


        </MyClubStack.Navigator>
    );
};


export default MyClubStacks;