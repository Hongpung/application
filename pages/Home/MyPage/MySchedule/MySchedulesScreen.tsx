import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Color } from '../../../../ColorSet';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Icons } from '@hongpung/components/Icon';
import { loginUserState, todayReservation } from '@hongpung/recoil/authState';
import { useRecoilValue } from 'recoil';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { MyPageParamList } from '@hongpung/nav/MyPageStack';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';



type MySchedulesProps = CompositeNavigationProp<
    NativeStackNavigationProp<MyPageParamList, 'MySchedules'>,
    NativeStackNavigationProp<MainStackParamList, 'Reservation'>
>;

const MySchedulesScreen: React.FC = () => {

    const userReservations = useRecoilValue(todayReservation);

    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const subtractDate = () => {
        const previousDay = new Date(selectedDate);
        previousDay.setDate(selectedDate.getDate() - 1);
        setSelectedDate(previousDay);
    };
    const addDate = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(selectedDate.getDate() + 1);
        setSelectedDate(nextDay);
    };
    const DateFormat = (selectedDate: Date): string => {
        return `${selectedDate.getUTCFullYear() + '.' + (selectedDate.getMonth() + 1) + '.' + selectedDate.getDate()}`
    }


    const renderBlankDay = () => {
        return (
            <View style={[styles.Container, { justifyContent: 'center' }]}>
                <View style={{ height: 70, marginTop: -120, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey800'] }}>오늘 예정된 일정이 없어요!</Text>
                    <Pressable>
                        <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>
                            {`오늘의 참여 가능한 일정 둘러보기  >`}
                        </Text>
                    </Pressable>
                </View>
            </View>)
    }

    return (
        <View style={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
        }}>
            <View style={{ top: 0, height: 64, width: '100%', alignItems: 'center', gap: 2 }}>
                <View style={{ paddingTop: 8, flexDirection: 'row', alignItems: 'center', height: 40 }}>
                    {/* 이전 버튼 */}
                    <Pressable style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }} onPress={subtractDate}>
                        <Icons size={24} name={'caret-back'} color={Color['blue500']} />
                    </Pressable>

                    <View style={{ width: 124, justifyContent: 'center', alignItems: 'center', height: 32, }}>
                        <Text style={{ fontSize: 20, fontFamily: 'NanumSquareNeo-Bold', textAlignVertical: 'center', }}>
                            {DateFormat(selectedDate)}
                        </Text>
                    </View>
                    {/* 이후 버튼 */}
                    <Pressable style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }} onPress={addDate}>
                        <Icons size={24} name={'caret-forward'} color={Color['blue500']} />
                    </Pressable>
                </View>
            </View>
            {userReservations?.length > 0 ? <ScrollView contentContainerStyle={styles.Container}>
                {userReservations.map((reserve: any) => <RenderDailySchedules key={reserve.reservationId} ScheduleData={reserve}/>)}
            </ScrollView> :
                renderBlankDay()}
        </View>

    )
}

export default MySchedulesScreen

const RenderDailySchedules: React.FC<{ ScheduleData: any }> = ({ ScheduleData }) => {

    const navigation = useNavigation<MySchedulesProps>();
    const loginUser = useRecoilValue(loginUserState);

    if (ScheduleData.creatorName != loginUser?.name)
        return (
            <Pressable style={{
                width: 320, height: 180, borderRadius: 5, borderWidth: 1, borderColor: Color['grey100'], marginVertical: 6, overflow: 'hidden'
            }}
                onPress={() => navigation.navigate('Reservation', { screen: 'ReservationDetail', params: { reservationId: ScheduleData.reservationId } })}>
                <Svg height="420" width="400" style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}>
                    <Defs>
                        <RadialGradient
                            id="grad"
                            cx="30%"
                            cy="56%"
                            rx="34%"
                            ry="32%"
                            fx="32%"
                            fy="58%"
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset="0%" stopColor="#5BBF88" />
                            <Stop offset="60%" stopColor="#B2CF82" />
                            <Stop offset="100%" stopColor="#FFFFFF" />
                        </RadialGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#grad)" />
                </Svg>
                <View style={{ position: 'absolute', flexDirection: 'row', left: 18, top: 18 }}>
                    <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['green500'] }}>참가하는 일정</Text>
                </View>
                <View style={{ position: 'absolute', width: 208, top: 62, left: 56 }}>
                    <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 18, textAlign: 'center', }} numberOfLines={1} ellipsizeMode='tail' >{ScheduleData.message}</Text>
                </View>
                <View style={{ position: 'absolute', right: 20, flexDirection: 'row', bottom: 50 }}>
                    <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>{ScheduleData.startTime.slice(0, -3)}~{ScheduleData.endTime.slice(0, -3)}</Text>
                </View>
                <View style={{ position: 'absolute', right: 20, flexDirection: 'row', bottom: 20, height: 24, alignItems: 'center' }}>
                    <View style={{ backgroundColor: Color['grey400'], height: 20, width: 20 }} /><Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>99</Text>
                </View>
            </Pressable >)
    else return (
        <Pressable style={{
            width: 320, height: 180, borderRadius: 5, borderWidth: 1, borderColor: Color['grey100'],
            overflow: 'hidden', marginVertical: 6
        }}
            onPress={() => navigation.navigate('Reservation', { screen: 'ReservationDetail', params: { reservationId: ScheduleData.reservationId } })}>
            <Svg height="420" width="400" style={[StyleSheet.absoluteFill, { opacity: 0.2 }]}>
                <Defs>
                    <RadialGradient
                        id="grad"
                        cx="30%"
                        cy="56%"
                        rx="34%"
                        ry="32%"
                        fx="32%"
                        fy="58%"
                        gradientUnits="userSpaceOnUse"
                    >
                        <Stop offset="0%" stopColor="#8048F5" />
                        <Stop offset="60%" stopColor="#64C2F7" />
                        <Stop offset="100%" stopColor="#FFFFFF" />
                    </RadialGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad)" />
            </Svg>
            <View style={{ position: 'absolute', flexDirection: 'row', left: 18, top: 18 }}>
                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['blue500'] }}>내가 만든 일정</Text>
            </View>
            <View style={{ position: 'absolute', width: 208, top: 62, left: 56 }}>
                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 18, textAlign: 'center', }} numberOfLines={1} ellipsizeMode='tail' >
                    {ScheduleData.message}
                </Text>
            </View>
            <View style={{ position: 'absolute', right: 20, flexDirection: 'row', bottom: 50 }}>
                <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>{ScheduleData.startTime.slice(0, -3)}~{ScheduleData.endTime.slice(0, -3)}</Text>
            </View>
            <View style={{ position: 'absolute', right: 20, flexDirection: 'row', bottom: 20, height: 24, alignItems: 'center' }}>
                <Icons size={24} name={'people'} color={Color['grey300']} />
                <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>99</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    Container: {
        flexGrow: 1,
        backgroundColor: '#fff',
    }
})