import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from './ChatScreen';
import React from 'react';
import Header from '../components/Header';
import HomeScreen from './HomeScreen';
import { Color } from '../ColorSet';
import QRScanScreen from './QRScanScreen';

const Tab = createBottomTabNavigator();

const BottomNav = () => {
    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{ tabBarStyle: { height: 96, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth:1, borderColor:Color['grey200'],backgroundColor: 'white',position:'absolute' }, headerShown: false, tabBarIconStyle: { width: 36, height: 36, marginTop:16, marginBottom:2,backgroundColor: 'grey' }, tabBarLabelStyle: { fontFamily: 'NanumSquareNeo-Bold', fontSize: 12 } }}>
            <Tab.Screen name="Home" component={HomeScreen}  />
            <Tab.Screen name="QRScan" component={QRScanScreen} options={{ headerShown: true, header: () => <Header leftButton='X' HeaderName='QR스캔' />, tabBarLabel: 'QR스캔', tabBarStyle: { display: 'none' } }} />
            <Tab.Screen name="Chat" component={ChatScreen} options={{ headerShown: true, header: () => <Header leftButton='X' HeaderName='채팅' />, tabBarLabel: '채팅', tabBarStyle: { display: 'none' } }} />
        </Tab.Navigator>
    );
}

export default BottomNav;