import MyClubScreen from "@hongpung/pages/Home/MyClub/MyClubScreen";
import InstrumentStacks, { ClubInstrumentStackParamList } from "./InstrumentStack";
import ClubCalendar, { SerializedReserve } from "@hongpung/pages/Home/MyClub/ClubCalendar/ClubCalendar";
import Header from '@hongpung/components/Header';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClubMemeberScreen from "@hongpung/pages/Home/MyClub/ClubMember/ClubMemeberScreen";
import { ScreenParams } from "./HomeStacks";


export type MyClubStackStackParamList = {
    MyClubHome: undefined;
    ClubMembers: undefined;
    Instruments: ScreenParams<ClubInstrumentStackParamList>
    ClubCalendar: undefined;
    PracticeInfo: { reserveInfo: SerializedReserve };
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
                    header: () => <Header leftButton='arrow-back' HeaderName='우리 동아리' />
                }}
            />


            <MyClubStack.Screen
                name="Instruments"
                component={InstrumentStacks}
            />

            <MyClubStack.Screen
                name='ClubCalendar'
                component={ClubCalendar}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='연습 기록 보기' />
                }}
            />

            {/* <MyClubStack.Screen
                name='PracticeInfo'
                component={PracticeInfoScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='연습 상세 기록' />
                }}
            /> */}

        </MyClubStack.Navigator>
    );
};


export default MyClubStacks;