import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import { debounce } from 'lodash'
import { useNavigation } from '@react-navigation/native';
import { Color } from '@hongpung/ColorSet';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';

type TodayScheduleNavParams = NativeStackNavigationProp<MainStackParamList, 'Home'>

const TodaySchedule: React.FC = () => {

    const navigation = useNavigation<TodayScheduleNavParams>();

    const hasReservation = false;

    useEffect(() => {

        const loadReservationData = async () => {
            // await loadUserReservation();
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
        <TouchableOpacity activeOpacity={0.95} style={[styles.ScheduleContainer, { backgroundColor: hasReservation ? Color['blue500'] : '' }]}
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
                    <View style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent:'center' }}>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey500'], fontSize: 18 }}>오늘의 일정이 없어요</Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: Color['grey300'], fontSize: 14 }}>새로운 일정 예약하러 가기</Text>
                    </View>}
        </TouchableOpacity >
    )
}


export default TodaySchedule


const styles = StyleSheet.create({
    ScheduleContainer: {
        height: 156,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: Color['grey300'],
        borderStyle: 'dashed'
    }
})