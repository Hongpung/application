import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from '../components/Header';
import NotificationScreen from '../pages/Home/Notification/NotificationScreen';
import MyPageScreen from '../pages/Home/MyPage/MyPageScreen';
import MySchedulesScreen from '../pages/Home/MyPage/MySchedule/MySchedulesScreen';
import MyBadgeScreen from '../pages/Home/MyPage/MyBadge/MyBadgeScreen';
import BottomNav from './BottomNav';
import MyClubScreen from '../pages/Home/MyClub/MyClubScreen';
import ClubMemeberScreen from '../pages/Home/MyClub/ClubMember/ClubMemeberScreen';
import ClubInstrumentsScreen from '../pages/Home/MyClub/Instruments/ClubInstrumentsScreen';
import InstrumentSpecificScreen from '../pages/Home/MyClub/Instruments/InstrumentSpecificScreen';
import InstrumentEditScreen from '../pages/Home/MyClub/Instruments/InstrumentEditScreen';
import { InstrumentProvider, useInstrument } from '../pages/Home/MyClub/Instruments/context/InstrumentContext';
import ClubCalendar from '../pages/Home/MyClub/ClubCalendar/ClubCalendar';
import PracticeInfoScreen from '../pages/share/PracticeInfoScreen';
import UsingManageScreen from '../pages/Home/UsingManageScreen';
import NotificationSettingScreen from '../pages/Setting/NotificationSetting';
import LoginSettingScreen from '../pages/Setting/LoginSetting';
import ReserveCalendarScreen from '../pages/Reserve/ReserveCalendarScreen';
import DailyReserveListScreen from '../pages/Reserve/DailyReserveListScreen';
import ReservationScreen from '../pages/Reserve/ReservationScreen';
import DateSelcectScreen from '../pages/Reserve/DateSelcectScreen';

// HomeStack Navigator
const MainStack = createNativeStackNavigator();

const MainStacks = () => {
    return (
        <MainStack.Navigator initialRouteName="BottomNav" screenOptions={{ headerShown: false, animationDuration: 50, animation: 'slide_from_right' }}>
            <MainStack.Screen name="BottomNav" component={BottomNav} options={{}} />
            <MainStack.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='X' HeaderName='알림' />
                }}
            />
            <MainStack.Screen
                name="MyPage"
                component={MyPageStacks}
                options={{
                    animation: 'none',
                }}
            />
            <MainStack.Screen
                name="MyClub"
                component={MyClubStacks}
                options={{
                    animation: 'none',
                }}
            />
            <MainStack.Screen
                name='UsingManage'
                component={UsingManageScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='X' HeaderName='현재 정보' />
                }}
            />
            <MainStack.Screen
                name='NotificationSetting'
                component={NotificationSettingScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='<-' HeaderName='알림 설정' />
                }}
            />
            <MainStack.Screen
                name='LoginSetting'
                component={LoginSettingScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='<-' HeaderName='로그인 설정' />
                }}
            />
            <MainStack.Screen
                name='ReserveCalendar'
                component={ReserveCalendarScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='<-' HeaderName='연습실 예약 조회' />
                }}
            />
            <MainStack.Screen
                name='DailyReserveList'
                component={DailyReserveListScreen}
                options={{
                    animation: 'none',
                }}
            />
            <MainStack.Screen
                name='Reservation'
                component={ReservationScreen}
                options={{
                    animation: 'none',
                    headerShown: true,
                    header: () => <Header leftButton='X' HeaderName='연습실 예약' />
                }}
            />

            <MainStack.Screen
                name='ResrvationDateSelect'
                component={DateSelcectScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='<-' HeaderName='예약 일시 선택' />
                }}
            />

        </MainStack.Navigator>
    );
};

// MyPageStack Navigator
const MyPageStack = createNativeStackNavigator();

const MyPageStacks = () => {
    return (
        <MyPageStack.Navigator initialRouteName="MyPageHome" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <MyPageStack.Screen
                name="MyPageHome"
                component={MyPageScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='X' HeaderName='마이페이지' />
                }}
            />
            <MyPageStack.Screen
                name="MySchedules"
                component={MySchedulesScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='<-' HeaderName='내 일정' />
                }}
            />
            <MyPageStack.Screen
                name="MyBadges"
                component={MyBadgeScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='<-' HeaderName='내 배지' />
                }}
            />
            <MyPageStack.Screen
                name='MyCalendar'
                component={ClubCalendar}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='<-' HeaderName='내 활동' />
                }}
            />
        </MyPageStack.Navigator>
    );
};

// MyClubStack Navigator
const MyClubStack = createNativeStackNavigator();

const MyClubStacks = () => {
    return (
        <MyClubStack.Navigator initialRouteName="MyClubHome" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <MyClubStack.Screen
                name="MyClubHome"
                component={MyClubScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='<-' HeaderName='우리 동아리' />
                }}
            />
            <MyClubStack.Screen
                name="ClubMembers"
                component={MyClubMembersStacks}
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
                    header: () => <Header leftButton='<-' HeaderName='연습 기록 보기' />
                }}
            />
            <MyClubStack.Screen
                name='PracticeInfo'
                component={PracticeInfoScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='<-' HeaderName='연습 상세 기록' />
                }}
            />

        </MyClubStack.Navigator>
    );
};

// MyClubMembersStack Navigator
const MyClubMembersStack = createNativeStackNavigator();

const MyClubMembersStacks = () => {
    return (
        <MyClubMembersStack.Navigator initialRouteName="ClubMembersHome" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <MyClubMembersStack.Screen
                name="ClubMembersHome"
                component={ClubMemeberScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='<-' HeaderName='우리 동아리' />
                }}
            />
        </MyClubMembersStack.Navigator>
    );
};

// InstrumentStack Navigator with Context
const InstrumentStack = createNativeStackNavigator();

const InstrumentStacks = () => {
    return (
        <InstrumentProvider>
            <InstrumentStack.Navigator initialRouteName="InstrumentsHome" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
                <InstrumentStack.Screen
                    name="InstrumentsHome"
                    component={ClubInstrumentsScreen}
                    options={{
                        headerShown: true,
                        animation: 'none',
                        header: () => <Header leftButton='<-' HeaderName='악기 관리' />
                    }}
                />
                <InstrumentStack.Screen
                    name="InstrumentSpecific"
                    component={InstrumentSpecificScreen}
                    options={({ navigation }) => ({
                        headerShown: true,
                        animation: 'none',
                        header: () => (
                            <Header
                                leftButton='X'
                                HeaderName='악기 상세'
                                RightButton='수정'
                                RightAction={() => navigation.push('InstrumentEdit')}
                                addLeftAction={() => {
                                    const { setSelectedInstrument } = useInstrument();
                                    setSelectedInstrument(null);
                                }}
                            />
                        )
                    })}
                />
                <InstrumentStack.Screen
                    name="InstrumentEdit"
                    component={InstrumentEditScreen}
                    options={{
                        headerShown: true,
                        animation: 'none',
                        header: () => (
                            <Header
                                leftButton='<-'
                                HeaderName='악기 수정'
                            />
                        )
                    }}
                />
            </InstrumentStack.Navigator>
        </InstrumentProvider>
    );
};

export default MainStacks;
