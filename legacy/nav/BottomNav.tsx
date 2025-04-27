import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Header from "@hongpung/src/common/components/header/Header";
import HomeScreen from '../pages/Home/HomeScreen';
import QRScanScreen from '../pages/QRScan/QRScanScreen';
import ReservationMainScreen from '../pages/Reservation/ReservationMainScreen';
import { Color } from '../ColorSet';
import { Icons } from '@hongpung/src/common/components/icons/Icon';
import MyPageScreen from '@hongpung/pages/MyPage/MyPageScreen';
import MyPageStacks from './MyPageStack';

export type BottomTabParamList = {
    Home: undefined;
    Reservation: undefined;
    QRScan: undefined;
    MyPage: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTab = () => {
    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{
            tabBarActiveTintColor: Color['blue500'],
            tabBarInactiveTintColor: Color['grey300'],
            tabBarStyle: {
                height: 64,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                backgroundColor: '#FFF',
                position: 'absolute'
            },
            headerShown: false,
            tabBarIconStyle: { width: 36, height: 36, marginTop: 8, marginBottom: 2 },
            tabBarLabelStyle: { fontFamily: 'NanumSquareNeo-Bold', fontSize: 12 },
        }}>

            <Tab.Screen name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => <Icons name={focused ? 'home' : 'home-outline'} color={color} />,
                    tabBarLabel: '홈'
                }} />

            <Tab.Screen name="Reservation"
                component={ReservationMainScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => <Icons name={focused ? 'calendar' : 'calendar-outline'} color={color} />,
                    tabBarLabel: '예약'
                }} />

            <Tab.Screen name="QRScan"
                component={QRScanScreen}
                options={{
                    tabBarIcon: ({ color }) => <Icons name={'qr-code-sharp'} color={color} />,
                    headerShown: true,
                    header: () => <Header leftButton='close' HeaderName='QR 스캔' />,
                    tabBarLabel: 'QR 스캔',
                    tabBarStyle: { display: 'none' }
                }} />
            <Tab.Screen name="MyPage"
                component={MyPageScreen}
                options={{
                    tabBarIcon: ({ color }) => <Icons name={'person'} color={color} />,
                    headerShown: true,
                    header: () => <Header leftButton={null} HeaderName='마이페이지' />,
                    tabBarLabel: '내 정보',
                }} />

            {/* <Tab.Screen name="Chat"
                component={ChatListScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => <Icons name={focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'} color={color} />,
                    headerShown: true,
                    header: () => <View style={{
                        height: 50,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#FFF',
                        paddingHorizontal: 24
                    }}>
                        <Text style={{
                            fontFamily: "NanumSquareNeo-Bold",
                            color: Color['grey800'],
                            fontSize: 20
                        }}>채팅</Text>
                    </View>,
                    tabBarLabel: '채팅',
                }} /> */}
        </Tab.Navigator>
    );
}

export default BottomTab;