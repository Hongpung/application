import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Header from '@hongpung/components/Header';

//screens
import NotificationScreen from '@hongpung/pages/Home/Notification/NotificationScreen';
import UsingManageScreen from '@hongpung/pages/Home/UsingManageScreen';
import ChatMediaViewerScreen from '@hongpung/pages/Chat/ChatMediaViewerScreen';
import CheckInScreen from '@hongpung/pages/QRScan/CheckInScreen';
import CheckOutScreen from '@hongpung/pages/QRScan/CheckOutScreen';
import CheckOutDescriptScreen from '@hongpung/pages/QRScan/CheckOutDescriptScreen';
import CheckOutCameraScreen from '@hongpung/pages/QRScan/CheckOutCameraScreen';
import PictureCheckScreen from '@hongpung/pages/QRScan/PictureCheckScreen';
import CheckOutEndScreen from '@hongpung/pages/QRScan/CheckOutEndScreen';
import ChatScreen from '@hongpung/pages/Chat/ChatScreen';

//nav
import BottomTab from './BottomNav';
import MyClubStacks from './MyClubStack';
import ReservationStacks from './ReservationStack';
import MyPageStacks from './MyPageStack';
import ExtraActivitiesStacks from './ExtraActivitiesStack';

const MainStack = createNativeStackNavigator();

const MainStacks = () => {
    return (
        <MainStack.Navigator initialRouteName="BottomTab" screenOptions={{ headerShown: false, animationDuration: 50, animation: 'slide_from_right' }}>

            <MainStack.Screen name="BottomTab" component={BottomTab} />

            <MainStack.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='close' HeaderName='알림' />,
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
                name="Reservation"
                component={ReservationStacks}
                options={{
                    animation: 'none',
                }} />

            <MainStack.Screen
                name='CheckIn'
                component={CheckInScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='arrow-back' />
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
                name='CheckOut'
                component={CheckOutStacks}
                options={{
                    animation: 'none',
                }}
            />

            <MainStack.Screen
                name='ExtraActivities'
                component={ExtraActivitiesStacks}
            />

            <MainStack.Screen
                name="ChatRoom"
                component={ChatScreen}
                options={{
                    animation: 'none',
                }}
            />

            <MainStack.Screen
                name='ChatViewer'
                component={ChatMediaViewerScreen}
                options={{
                    animationDuration: 100,
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


export default MainStacks;
