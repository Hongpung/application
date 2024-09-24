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
import { InstrumentProvider, useInstrument } from "../context/InstrumentContext"
import ClubCalendar from '../pages/Home/MyClub/ClubCalendar/ClubCalendar';
import PracticeInfoScreen from '../pages/share/PracticeInfoScreen';
import UsingManageScreen from '../pages/Home/UsingManageScreen';
import NotificationSettingScreen from '../pages/Setting/NotificationSetting';
import LoginSettingScreen from '../pages/Setting/LoginSetting';
import ReserveCalendarScreen from '../pages/Reserve/ReserveCalendarScreen';
import DailyReserveListScreen from '../pages/Reserve/DailyReserveListScreen';
import ReservationScreen from '../pages/Reserve/ReservationScreen';
import DateSelcectScreen from '../pages/Reserve/DateSelcectScreen';
import TimeSelectScreen from '../pages/Reserve/TimeSelectScreen';
import BorrowInstrumentSelectScreen from '../pages/Reserve/BorrowInstrumentSelectScreen';
import ChatMediaViewerScreen from '../pages/Chat/ChatMediaViewerScreen';
import { ReservationProvider } from '../context/ReservationContext';
import ParticipantsSelectScreen from '../pages/Reserve/ParticipantsSelectScreen';
import ReservationConfirmScreen from '../pages/Reserve/ReservationConfirmScreen';
import CheckInScreen from '../pages/QRScan/CheckInScreen';
import CheckOutScreen from '../pages/QRScan/CheckOutScreen';
import CheckOutDescriptScreen from '../pages/QRScan/CheckOutDescriptScreen';
import CheckOutCameraScreen from '../pages/QRScan/CheckOutCameraScreen';
import PictureCheckScreen from '../pages/QRScan/PictureCheckScreen';
import CheckOutEndScreen from '../pages/QRScan/CheckOutEndScreen';
import ActivitiesScreen from '../pages/ExtaraActivities/ActivitiesListScreen';
import MyPracticesScreen from '../pages/Home/MyPage/MyPractices/MyPracticesScreen';

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

            {/* 대여 중 반납 화면 */}
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
                name="Reservation"
                component={ReservationStacks}
                options={{
                    animation: 'none',
                }} />

                {/* 채팅 사진 화면 */}
            <MainStack.Screen
                name='ChatViewer'
                component={ChatMediaViewerScreen}
                options={{
                    animationDuration: 100,
                }}
            />
            {/* 연습 시작 화면 */}
            <MainStack.Screen
                name='CheckIn'
                component={CheckInScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='<-' />
                }}
            />

            <MainStack.Screen
                name='CheckOut'
                component={CheckOutStacks}
                options={{
                    animation: 'none',
                }}
            />

            <MainStack.Screen
                name='ExtaraActivities'
                component={ExtaraActivitiesStacks}
            />



        </MainStack.Navigator>
    );
};

const CheckOutStack = createNativeStackNavigator();

const CheckOutStacks = () => {
    return (
        <CheckOutStack.Navigator initialRouteName="CheckOutStart" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <CheckOutStack.Screen
                name='CheckOutStart'
                component={CheckOutScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='<-' />
                }}
            />

            <CheckOutStack.Screen
                name='CheckOutDescript'
                component={CheckOutDescriptScreen}
            />

            <CheckOutStack.Screen
                name='CheckOutCamera'
                component={CheckOutCameraScreen}
            />

            <CheckOutStack.Screen
                name='PictureCheck'
                component={PictureCheckScreen}
            />
            <CheckOutStack.Screen
                name='CheckOutEnd'
                component={CheckOutEndScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: ({ navigation }) => <Header leftButton='X' LeftAction={() => navigation.navigate('Home')} />
                }}
            />
        </CheckOutStack.Navigator>
    );
};

const ExtaraActivitiesStack = createNativeStackNavigator();

const ExtaraActivitiesStacks = () => {
    return (
        <ExtaraActivitiesStack.Navigator initialRouteName="ActivitiesList" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <ExtaraActivitiesStack.Screen
                name='ActivitiesList'
                component={ActivitiesScreen}
            />
        </ExtaraActivitiesStack.Navigator>
    );
};

const ReservationStack = createNativeStackNavigator();

const ReservationStacks = () => {
    return (
        <ReservationProvider>
            <ReservationStack.Navigator initialRouteName="ReserveCalendar" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>

                <ReservationStack.Screen
                    name='ReserveCalendar'
                    component={ReserveCalendarScreen}
                    options={{
                        headerShown: true,
                        header: ({ navigation }) => <Header leftButton='<-' HeaderName='연습실 예약 조회' RightButton='예약'
                            RightAction={() => navigation.push('Reservation')} />
                    }}
                />
                <ReservationStack.Screen
                    name='DailyReserveList'
                    component={DailyReserveListScreen}
                    options={{
                        animation: 'none',
                    }}
                />

                <ReservationStack.Screen
                    name='Reservation'
                    component={ReservationScreen}
                    options={{
                        animation: 'none',
                        headerShown: true,
                        header: () => <Header leftButton='X' HeaderName='연습실 예약' />
                    }}
                />
                <ReservationStack.Screen
                    name='ResrvationDateSelect'
                    component={DateSelcectScreen}
                    options={{
                        headerShown: true,
                        animation: 'none',
                        header: ({ navigation }) => <Header leftButton='<-' HeaderName='예약 일시 선택' LeftAction={() => navigation.navigate('Reservation')} />
                    }}
                />
                <ReservationStack.Screen
                    name='TimeSelect'
                    component={TimeSelectScreen}
                    options={{
                        animation: 'none',
                    }}
                />
                <ReservationStack.Screen
                    name='BorrowInstrumentSelect'
                    component={BorrowInstrumentSelectScreen}
                    options={{
                        animationDuration: 100,
                    }}
                />

                <ReservationStack.Screen
                    name='ParticipantsSelect'
                    component={ParticipantsSelectScreen}
                    options={{
                        animationDuration: 100,
                    }}
                />

                <ReservationStack.Screen
                    name='ReservationConfirm'
                    component={ReservationConfirmScreen}
                    options={{
                        headerShown: true,
                        animation: 'none',
                        header: ({ navigation }) => <Header leftButton='X' LeftAction={() => navigation.navigate('Reservation')} />
                    }}
                />

            </ReservationStack.Navigator>
        </ReservationProvider>

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
                name='MyPractices'
                component={MyPracticesScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='<-' HeaderName='내 활동' />
                }}
            />

            <MyPageStack.Screen
                name='NotificationSetting'
                component={NotificationSettingScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='<-' HeaderName='알림 설정' />
                }}
            />

            <MyPageStack.Screen
                name='LoginSetting'
                component={LoginSettingScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='<-' HeaderName='로그인 설정' />
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
