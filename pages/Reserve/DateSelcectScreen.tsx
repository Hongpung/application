import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Calendar } from './ReserveCalendarScreen'
import { useFocusEffect } from '@react-navigation/native';
import { useReservation } from '../../context/ReservationContext';

const DateSelcectScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {

    const [calendarDate, setCalendarDate] = useState(new Date())
    const { reservation, setDate } = useReservation();


    useFocusEffect(
        useCallback(() => {

            const newDate = reservation.date
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