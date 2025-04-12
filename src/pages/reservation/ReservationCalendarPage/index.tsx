import React from 'react'
import { StyleSheet, View } from 'react-native'

import ReservationTypeTable from '@hongpung/src/entities/reservation/ui/ReservationTypeTable';

import { FullCalendar } from '@hongpung/src/widgets/reservation/ui/FullCalendar/FullCalendar';
import { useReservationCalendar } from '@hongpung/src/features/reservation/figureReservation/model/useReservationCalendar';

const ReservationCalendarPage: React.FC<ReservationStackProps<'ReservationCalendar'>> = ({ navigation }) => {
    const { ...calendarProps } = useReservationCalendar();

    return (
        <View style={styles.container}>
            <View style={styles.typeTable}>
                <ReservationTypeTable />
            </View>
            <View style={styles.calendarContainer}>
                <FullCalendar
                    onClickDate={(date) => {
                        const dateString = date.toISOString().split('T')[0];
                        navigation.push('DailyReserveList', { date: dateString })
                        navigation.getParent()?.navigate('')
                    }}
                    {...calendarProps}
                />
            </View>
        </View>
    )
}

export default ReservationCalendarPage

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flex: 1,
    },
    typeTable: {
        position: 'absolute',
        right: 32,
        top: 30,
    },
    calendarContainer: {
        marginTop: 88,
        flex: 1,
    },
});