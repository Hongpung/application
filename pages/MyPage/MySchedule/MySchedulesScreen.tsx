import { Pressable, ScrollView, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Color } from '@hongpung/ColorSet';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Icons } from '@hongpung/src/common/components/icons/Icon';
import { loginUserState, TodayReservation, todayReservations } from '@hongpung/recoil/authState';
import { useRecoilValue } from 'recoil';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { MyPageParamList } from '@hongpung/nav/MyPageStack';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';
import useFetchUsingToken from '@hongpung/src/common/hooks/useFetchUsingToken';
import { ReservationCardComponent } from '@hongpung/components/home/TodaySchedule';
import { debounce } from 'lodash';

type MySchedulesNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<MyPageParamList, 'MySchedules'>,
    NativeStackNavigationProp<MainStackParamList, 'Reservation'>
>;

const BlankDay = () => {
    const navigation = useNavigation<MySchedulesNavigationProp>();
    const navigateToReservation = debounce(() => {
        navigation.navigate('Reservation')
    }, 50);
    return (
        <View style={[styles.Container, { justifyContent: 'center' }]}>
            <View style={{ marginTop: -120, alignItems: 'center', gap: 12 }}>
                <Text style={{ fontSize: 24, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey800'] }}>예정된 일정이 없어요!</Text>
                <Pressable onPress={navigateToReservation}>
                    <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>
                        {`새 일정 예약하러 가기  >`}
                    </Text>
                </Pressable>
            </View>
        </View>)
}

const MySchedulesScreen: React.FC = () => {

    const [skip, setSkip] = useState(0);
    const [reservationList, setReservationList] = useState<TodayReservation[]>([]);
    const { data: loadReservations } =
        useFetchUsingToken<TodayReservation[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/reservation/my-schedule?skip=${skip}`, {}, 5000, [skip]);


    const seperateReservations = (reservations: TodayReservation[]) => {
        const ReservationsByTerm: Record<string, TodayReservation[]> = {}

        reservations.forEach((reservation: TodayReservation) => {
            const date = reservation.date
            if (!ReservationsByTerm[date]) {
                ReservationsByTerm[date] = [reservation]
            } else {
                ReservationsByTerm[date].push(reservation)
            }
        })

        return ReservationsByTerm
    }


    const getDisplayDate: (date: string) => { string: string, style?: StyleProp<TextStyle> } = useCallback((date: string) => {
        const UTCTime = new Date();
        const korTime = new Date(UTCTime.getTime() + 9 * 60 * 60 * 1000);
        const korDate = korTime.toISOString().split('T')[0];

        const targetDate = new Date(date);
        const today = new Date(korDate);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        if (korDate === date) return { string: '오늘', style: { color: Color['grey700'], fontSize: 16 } };
        if (tomorrow.toISOString().split('T')[0] === date) return { string: '내일', style: { color: Color['grey700'], fontSize: 14 } };
        if (targetDate >= startOfWeek && targetDate <= endOfWeek) return { string: '이번 주', style: { color: Color['grey500'] } };
        if (targetDate >= startOfMonth && targetDate <= endOfMonth) return { string: '이번 달', style: { color: Color['grey400'] } };
        return { string: date, style: { color: Color['grey400'] } };
    }, [])

    useEffect(() => {
        if (!!loadReservations && loadReservations.length > 0) {
            setReservationList((prev) => ([...prev, ...loadReservations]))
            setSkip(prev => prev + 1)
        }
    }, [loadReservations])

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            width: '100%',
        }}>
            {/* <View style={{ top: 0, height: 64, width: '100%', alignItems: 'center', gap: 2 }}>
                <View style={{ paddingTop: 8, flexDirection: 'row', alignItems: 'center', height: 40 }}>
                   
                    <Pressable style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }} onPress={subtractDate}>
                        <Icons size={24} name={'caret-back'} color={Color['blue500']} />
                    </Pressable>

                    <View style={{ width: 124, justifyContent: 'center', alignItems: 'center', height: 32, }}>
                        <Text style={{ fontSize: 20, fontFamily: 'NanumSquareNeo-Bold', textAlignVertical: 'center', }}>
                            {DateFormat(selectedDate)}
                        </Text>
                    </View>
                    
                    <Pressable style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }} onPress={addDate}>
                        <Icons size={24} name={'caret-forward'} color={Color['blue500']} />
                    </Pressable>
                </View>
            </View> */}
            {reservationList.length > 0 ?
                <ScrollView contentContainerStyle={[styles.Container, { paddingHorizontal: 24, paddingVertical: 12 }]} alwaysBounceVertical={false}>
                    {Object.entries(seperateReservations(reservationList)).sort((a, b) => a[0].localeCompare(b[0])).map(([date, reservations]) => {

                        const { string: dateString, style } = getDisplayDate(date);

                        return (
                            <View key={date}>
                                <Text style={[{ marginVertical: 8, marginHorizontal: 4, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey500'], fontSize: 16 }, style]}>
                                    {
                                        dateString
                                    }
                                </Text>
                                {reservations.map((reservation, index) => (
                                    <View key={index} style={{ marginVertical: 4 }}>

                                        <ReservationCardComponent key={index} todayReservation={reservation} />
                                    </View>
                                ))}
                            </View>

                        )
                    }
                    )}
                    {reservationList.length == skip * 10 &&
                        <View style={{ display: 'flex', width: '100%', alignItems: 'center', marginVertical: 12 }}>
                            <Pressable style={{ width: 'auto', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 100, borderColor: Color['grey300'] }} onPress={() => setSkip(prev => prev + 1)}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-Regular', paddingVertical: 12, paddingHorizontal: 16, fontSize: 16, color: Color['grey500'] }}>더보기</Text>
                            </Pressable>
                        </View>
                    }
                </ScrollView> :
                <BlankDay />}
        </View>

    )
}

export default MySchedulesScreen

const RenderDailySchedules: React.FC<{ ScheduleData: any }> = ({ ScheduleData }) => {

    const navigation = useNavigation<MySchedulesNavigationProp>();
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