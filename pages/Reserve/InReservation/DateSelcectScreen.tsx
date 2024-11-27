import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Calendar } from '../ReserveCalendarScreen'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useReservation } from '../context/ReservationContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InReservationStackParamList } from '@hongpung/nav/ReservationStack';


type DateSelcectNavProps = NativeStackNavigationProp<InReservationStackParamList, 'ResrvationDateSelect'>

const DateSelcectScreen: React.FC = () => {

    const navigation = useNavigation<DateSelcectNavProps>();

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
            <Calendar
                calendarDate={calendarDate}
                onClickDate={(date: Date) => {
                    if (date > new Date()) {
                        const newDate = new Date(date)
                        setDate(newDate)
                        navigation.navigate('TimeSelect')
                    }
                }} />
        </View>
    )
}

export default DateSelcectScreen

const styles = StyleSheet.create({})