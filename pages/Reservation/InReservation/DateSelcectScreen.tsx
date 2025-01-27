import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Calendar } from '../ReservationCalendarScreen'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useReservation } from '../context/ReservationContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InReservationStackParamList } from '@hongpung/nav/ReservationStack';
import { Color } from '@hongpung/ColorSet';


type DateSelcectNavProps = NativeStackNavigationProp<InReservationStackParamList, 'ResrvationDateSelect'>

const DateSelcectScreen: React.FC = () => {

    const navigation = useNavigation<DateSelcectNavProps>();

    const today = new Date();
    const { reservation, setDate } = useReservation();

    const [calendarDate, setCalendarDate] = useState(reservation.date || new Date())

    useFocusEffect(
        useCallback(() => {
            const newDate = reservation.date ? new Date(reservation.date) : new Date();
            setCalendarDate(newDate);
        }, [reservation.date])
    );

    // useEffect(() => {
    //     if (reservation.date)
    //         navigation.navigate('TimeSelect')
    // }, [reservation])

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <View style={{ position: 'absolute', right: 32, top: 30 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: Color['blue500'], height: 4, width: 20, borderRadius: 5, marginRight: 8 }} />
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>정규 일정</Text>
                </View>
                <View style={{ height: 4 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: Color['red500'], height: 4, width: 20, borderRadius: 5, marginRight: 8 }} />
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>참여 불가</Text>
                </View>
                <View style={{ height: 4 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: Color['green500'], height: 4, width: 20, borderRadius: 5, marginRight: 8 }} />
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>참여 가능</Text>
                </View>
            </View>

            <View style={{ marginTop: 88, flex: 1 }}>
                <Calendar
                    calendarDate={calendarDate}
                    onClickDate={(date: Date) => {
                        console.log(date > new Date(today.getTime() + 13 * 60 * 60 * 1000),date , new Date(today.getTime() + 13 * 60 * 60 * 1000))
                        if (date > new Date(today.getTime() + 13 * 60 * 60 * 1000)) {
                            const newDate = new Date(date)
                            setDate(newDate)
                            navigation.navigate('TimeSelect')
                        }
                    }} />
            </View>

        </View>
    )
}

export default DateSelcectScreen

const styles = StyleSheet.create({})