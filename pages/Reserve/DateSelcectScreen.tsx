import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Calendar } from './ReserveCalendarScreen'
import { useFocusEffect } from '@react-navigation/native';

const DateSelcectScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {

    const [calendarDate, setCalendarDate] = useState(new Date())

    useFocusEffect(
        useCallback(() => {
            if (route.params?.date) {
                const newDate = new Date(route.params.date);
                console.log(newDate)
                if (calendarDate.getTime() !== newDate.getTime()) {
                    setCalendarDate(newDate);
                }
            }
        }, [route.params?.date])
    );
    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <Calendar
                calendarDate={calendarDate}
                onClickDate={(date: Date) => {
                    navigation.push(`TimeSelect`, { date: date.toString() })
                }} />
        </View>
    )
}

export default DateSelcectScreen

const styles = StyleSheet.create({})