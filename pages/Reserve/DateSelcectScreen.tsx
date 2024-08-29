import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Calendar } from './ReserveCalendarScreen'

const DateSelcectScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <Calendar onClickDate={(date: Date) => {
                navigation.push(`DailyReserveList`, { date: date.getTime() })
            }} />
        </View>
    )
}

export default DateSelcectScreen

const styles = StyleSheet.create({})