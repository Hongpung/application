import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from '../pages/Chat/ChatScreen';
import React from 'react';
import Header from '../components/Header';
import HomeScreen from '../pages/Home/HomeScreen';
import QRScanScreen from '../pages/QRScan/QRScanScreen';
import ReserveMainScreen from '../pages/Reserve/ReserveMainScreen';
import { Color } from '../ColorSet';

const Tab = createBottomTabNavigator();

const BottomNav = () => {
    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{ tabBarStyle: { height: 80, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFF', position: 'absolute' }, headerShown: false, tabBarIconStyle: { width: 36, height: 36, marginTop: 16, marginBottom: 2, backgroundColor: Color['grey300'] }, tabBarLabelStyle: { fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['grey300'] } }}>
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '홈' }} />
            <Tab.Screen name="Reserve" component={ReserveMainScreen} options={{ tabBarLabel: '예약' }} />
            <Tab.Screen name="QRScan" component={QRScanScreen} options={{ headerShown: true, header: () => <Header leftButton='X' HeaderName='QR스캔' />, tabBarLabel: 'QR 스캔', tabBarStyle: { display: 'none' } }} />
            <Tab.Screen name="Chat" component={ChatScreen} options={{ headerShown: true, header: () => <Header leftButton='X' HeaderName='채팅' />, tabBarLabel: '채팅', tabBarStyle: { display: 'none' } }} />
        </Tab.Navigator>
    );
}

export default BottomNav;