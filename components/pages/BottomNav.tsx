import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStacks from './HomeStacks';
import Chat from './Chat';
import { HomeStackParamList } from './pageTypes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import Header from '../Header';
import HomeScreen from './Home';
import { View } from 'react-native';
import { Color } from '../../ColorSet';

const Tab = createBottomTabNavigator();

const BottomNav = () => {
    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{ tabBarStyle: { height: 96, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth:1, borderColor:Color['grey200'],backgroundColor: 'white',position:'absolute' }, headerShown: false, tabBarIconStyle: { width: 36, height: 36, marginTop:16, marginBottom:2,backgroundColor: 'grey' }, tabBarLabelStyle: { fontFamily: 'NanumSquareNeo-Bold', fontSize: 12 } }}>
            <Tab.Screen name="Home" component={HomeScreen}  />
            <Tab.Screen name="Chat" component={Chat} options={{ headerShown: true, header: () => <Header leftButton='X' HeaderName='채팅' />, tabBarLabel: '채팅', tabBarStyle: { display: 'none' } }} />
        </Tab.Navigator>
    );
}

export default BottomNav;