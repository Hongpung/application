import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from '@hongpung/components/Header';
import NotificationScreen from '@hongpung/pages/Home/Notification/NotificationScreen';
import MyPageScreen from '@hongpung/pages/Home/MyPage/MyPageScreen';
import MySchedulesScreen from '@hongpung/pages/Home/MyPage/MySchedule/MySchedulesScreen';
import MyBadgeScreen from '@hongpung/pages/Home/MyPage/MyBadge/MyBadgeScreen';
import BottomNav from './BottomNav';
import MyClubScreen from '@hongpung/pages/Home/MyClub/MyClubScreen';
import ClubMemeberScreen from '@hongpung/pages/Home/MyClub/ClubMember/ClubMemeberScreen';
import ClubInstrumentsScreen from '@hongpung/pages/Home/MyClub/Instruments/ClubInstrumentsScreen';
import InstrumentSpecificScreen from '@hongpung/pages/Home/MyClub/Instruments/InstrumentSpecificScreen';
import InstrumentEditScreen from '@hongpung/pages/Home/MyClub/Instruments/InstrumentEditScreen';
import { InstrumentProvider, useInstrument } from "@hongpung/context/InstrumentContext"
import ClubCalendar from '@hongpung/pages/Home/MyClub/ClubCalendar/ClubCalendar';
import PracticeInfoScreen from '@hongpung/pages/share/PracticeInfoScreen';
import UsingManageScreen from '@hongpung/pages/Home/UsingManageScreen';
import NotificationSettingScreen from '@hongpung/pages/Setting/NotificationSetting';
import LoginSettingScreen from '@hongpung/pages/Setting/LoginSetting';
import ReserveCalendarScreen from '@hongpung/pages/Reserve/ReserveCalendarScreen';
import DailyReserveListScreen from '@hongpung/pages/Reserve/DailyReserveListScreen';
import ReservationScreen from '@hongpung/pages/Reserve/InReservation/ReservationScreen';
import DateSelcectScreen from '@hongpung/pages/Reserve/InReservation/DateSelcectScreen';
import TimeSelectScreen from '@hongpung/pages/Reserve/InReservation/TimeSelectScreen';
import BorrowInstrumentSelectScreen from '@hongpung/pages/Reserve/InReservation/BorrowInstrumentSelectScreen';
import ChatMediaViewerScreen from '@hongpung/pages/Chat/ChatMediaViewerScreen';
import { ReservationProvider } from '@hongpung/pages/Reserve/context/ReservationContext';
import ParticipantsSelectScreen from '@hongpung/pages/Reserve/InReservation/ParticipantsSelectScreen';
import ReservationConfirmScreen from '@hongpung/pages/Reserve/InReservation/ReservationConfirmScreen';
import CheckInScreen from '@hongpung/pages/QRScan/CheckInScreen';
import CheckOutScreen from '@hongpung/pages/QRScan/CheckOutScreen';
import CheckOutDescriptScreen from '@hongpung/pages/QRScan/CheckOutDescriptScreen';
import CheckOutCameraScreen from '@hongpung/pages/QRScan/CheckOutCameraScreen';
import PictureCheckScreen from '@hongpung/pages/QRScan/PictureCheckScreen';
import CheckOutEndScreen from '@hongpung/pages/QRScan/CheckOutEndScreen';
import ActivitiesScreen from '@hongpung/pages/ExtaraActivities/ActivitiesListScreen';
import MyPracticesScreen from '@hongpung/pages/Home/MyPage/MyPractices/MyPracticesScreen';
import ReservationDetailScreen from '@hongpung/pages/Reserve/ViewDetailReservation/ReservationDetailScreen';
import { NavigationContainer } from '@react-navigation/native';
import ReservationEditConfirmScreen from '@hongpung/pages/Reserve/InReservation/ReservationEditConfirm';
import ChatScreen from '@hongpung/pages/Chat/ChatScreen';

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
                    header: () => <Header leftButton='close' HeaderName='알림' />
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
                    header: () => <Header leftButton='close' HeaderName='현재 정보' />
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
                    header: () => <Header leftButton='arrow-back' />
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

            <MainStack.Screen
                name="ChatRoom"
                component={ChatScreen}
                options={{
                    animation: 'none',
                }}
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
                    header: () => <Header leftButton='arrow-back' />
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
                    header: ({ navigation }) => <Header leftButton='close' LeftAction={() => navigation.navigate('Home')} />
                }}
            />
        </CheckOutStack.Navigator>
    );
};

const EclosetaraActivitiesStack = createNativeStackNavigator();

const ExtaraActivitiesStacks = () => {
    return (
        <EclosetaraActivitiesStack.Navigator initialRouteName="ActivitiesList" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <EclosetaraActivitiesStack.Screen
                name='ActivitiesList'
                component={ActivitiesScreen}
            />
        </EclosetaraActivitiesStack.Navigator>
    );
};

const ReservationStack = createNativeStackNavigator();

const InReservationStack = createNativeStackNavigator();

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
                        header: () => <Header leftButton='close' HeaderName='연습실 예약' />
                    }}
                />
                <InReservationStack.Screen
                    name='ResrvationDateSelect'
                    component={DateSelcectScreen}
                    options={{
                        headerShown: true,
                        animation: 'none',
                        header: ({ navigation }) => <Header leftButton='close' HeaderName='예약 일시 선택' LeftAction={() => navigation.navigate('inReservation')} />
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
                        headerShown: true,
                        animation: 'none',
                        header: () => <Header leftButton='close' />
                    }}
                />
                <InReservationStack.Screen
                    name='ReservationEditConfirm'
                    component={ReservationEditConfirmScreen}
                    options={{
                        headerShown: true,
                        animation: 'none',
                        header: () => <Header leftButton='close' />
                    }}
                />

            </InReservationStack.Navigator>
        </ReservationProvider>
    )
}

const ReservationStacks = () => {
    return (
        <ReservationStack.Navigator initialRouteName="ReserveCalendar" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <ReservationStack.Screen
                name='ReserveCalendar'
                component={ReserveCalendarScreen}
                options={{
                    headerShown: true,
                    header: ({ navigation }) => <Header leftButton='close' HeaderName='연습실 예약 조회' RightButton='예약'
                        RightAction={() => {
                            const newDate = new Date();
                            navigation.push('Reservation', { date: newDate.setDate(newDate.getDate() + 1) })
                        }}
                    />
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
                name='ReservationDetail'
                component={ReservationDetailScreen}
                options={{
                    animation: 'none',
                    headerShown: true,
                    header: () => <Header leftButton='close' HeaderName='예약 조회' />
                }}
            />

            <ReservationStack.Screen
                name='Reservation'
                component={InReservationStacks}
            />
        </ReservationStack.Navigator>
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
                    header: () => <Header leftButton='close' HeaderName='마이페이지' />
                }}
            />
            <MyPageStack.Screen
                name="MySchedules"
                component={MySchedulesScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='arrow-back' HeaderName='내 일정' />
                }}
            />
            <MyPageStack.Screen
                name="MyBadges"
                component={MyBadgeScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='arrow-back' HeaderName='내 배지' />
                }}
            />
            <MyPageStack.Screen
                name='MyPractices'
                component={MyPracticesScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='내 활동' />
                }}
            />

            <MyPageStack.Screen
                name='NotificationSetting'
                component={NotificationSettingScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='알림 설정' />
                }}
            />

            <MyPageStack.Screen
                name='LoginSetting'
                component={LoginSettingScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='로그인 설정' />
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
                    header: () => <Header leftButton='arrow-back' HeaderName='우리 동아리' />
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
                    header: () => <Header leftButton='arrow-back' HeaderName='연습 기록 보기' />
                }}
            />
            <MyClubStack.Screen
                name='PracticeInfo'
                component={PracticeInfoScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='연습 상세 기록' />
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
                    header: () => <Header leftButton='arrow-back' HeaderName='우리 동아리' />
                }}
            />
        </MyClubMembersStack.Navigator>
    );
};

// InstrumentStack Navigator with Contecloset
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
                        header: ({navigation}) => <Header leftButton='arrow-back' HeaderName='악기 관리' RightButton='추가' RightAction={()=> navigation.navigate('InstrumentEdit')} />
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
                                leftButton='close'
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
                                leftButton='arrow-back'
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
