import React from 'react'

import { StyleSheet, Text, View } from 'react-native'

import ReservationTypeTable from '@hongpung/src/entities/reservation/ui/ReservationTypeTable';

import { useCreateReservation } from '@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context';
import { FullCalendar } from '@hongpung/src/widgets/reservation/ui/FullCalendar/FullCalendar';
import { useReservationCalendar } from '@hongpung/src/features/reservation/figureReservation/model/useReservationCalendar';



const DateSelcectScreen: React.FC = () => {

    const { reservation, setDate } = useCreateReservation();
    const calendarProps = useReservationCalendar(reservation.date);

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>

            <View style={{ position: 'absolute', right: 32, top: 30 }}>
                <ReservationTypeTable />
            </View>

            <View style={{ marginTop: 88, flex: 1 }}>

                <FullCalendar
                    onClickDate={(date) => {
                        const dateString = date.toISOString().split('T')[0];
                        setDate(dateString);
                    }}

                    {...calendarProps}
                />

            </View>

        </View>
    )
}

export default DateSelcectScreen

const styles = StyleSheet.create({})