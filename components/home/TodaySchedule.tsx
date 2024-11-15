import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import { debounce } from 'lodash'
import { useNavigation } from '@react-navigation/native';
import { Color } from '@hongpung/ColorSet';
import { useUserReserve } from '@hongpung/hoc/useUserReserve';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';

type TodayScheduleNavParams = NativeStackNavigationProp<MainStackParamList, 'Home'>

const TodaySchedule: React.FC = () => {

    const navigation = useNavigation<TodayScheduleNavParams>();

    const { userReservations, loadUserReservation } = useUserReserve();
    const hasReservation = useMemo(() => userReservations.length > 0, [userReservations])

    useEffect(() => {

        const loadReservationData = async () => {
            await loadUserReservation();
        }
        loadReservationData();

    }, [])
    const navigateToMySchedules = debounce(() => {
        navigation.navigate('MyPage', { screen: 'MySchedules' })
    }, 50);
    const navigateToReservation = debounce(() => {
        navigation.navigate('Reservation')
    }, 50);

    return (
        <TouchableOpacity activeOpacity={0.95} style={[styles.ScheduleContainer, { backgroundColor: hasReservation ? Color['blue500'] : Color['green500'] }]}
            onPress={() => {
                if (hasReservation) navigateToMySchedules()
                else navigateToReservation()
            }}>
            {
                hasReservation ?
                    <View style={{ position: 'absolute', display: 'flex', gap: 4, bottom: 12, left: 20 }
                    } >
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14 }}>오늘의 일정이 있어요</Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: '#FFF', fontSize: 18 }}>예약 확인하러 가기</Text>
                    </View > :
                    <View style={{ position: 'absolute', display: 'flex', gap: 4, bottom: 12, left: 20 }}>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14 }}>오늘의 일정이 없어요</Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: '#FFF', fontSize: 18 }}>새로운 일정 예약하러 가기</Text>
                    </View>}
        </TouchableOpacity >
    )
}

export default TodaySchedule

const styles = StyleSheet.create({
    ScheduleContainer: {
        height: 156,
        borderRadius: 10,
    }
})