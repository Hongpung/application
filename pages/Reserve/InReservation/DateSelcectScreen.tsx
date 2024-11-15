import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Calendar } from '../ReserveCalendarScreen'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useReservation } from '../context/ReservationContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';
import { InReservationStackParamList } from '@hongpung/nav/ReservationStack';


type DateSelcectNavProps = NativeStackNavigationProp<InReservationStackParamList, 'ResrvationDateSelect'>

const DateSelcectScreen: React.FC = () => {
    const navigation = useNavigation<DateSelcectNavProps>();
    const [calendarDate, setCalendarDate] = useState(new Date())
    const { reservation, setDate } = useReservation();


    useFocusEffect(
        useCallback(() => {

            const newDate = reservation.date ? new Date(reservation.date) : new Date();
            setCalendarDate(newDate);

        }, [reservation.date])
    );

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <Calendar
                calendarDate={calendarDate}
                onClickDate={(date: Date) => {
                    if (date > new Date()) {
                        setDate(date)
                        navigation.push(`TimeSelect`)
                    }
                }} />
        </View>
    )
}

export default DateSelcectScreen

const styles = StyleSheet.create({})