import React from 'react'

import { StyleSheet, View } from 'react-native'

import ReservationTypeTable from '@hongpung/src/entities/reservation/ui/ReservationTypeTable';

import { FullCalendar } from '@hongpung/src/widgets/reservation/ui/FullCalendar/FullCalendar';
import { useReservationCalendar } from '@hongpung/src/features/reservation/configureReservation';
import { useEditReservation } from '@hongpung/src/features/reservation/editReservation/model/useEditReservation.context';
import { EditReservationStackScreenProps } from '@hongpung/src/common/navigation';
import { Header } from '@hongpung/src/common';



const DateSelcectScreen: React.FC<EditReservationStackScreenProps<"EditReservationDateSelect">> = ({ navigation }) => {

    const { reservation, setDate } = useEditReservation();
    const calendarProps = useReservationCalendar(reservation.date);

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <Header
                leftButton="close"
                headerName="예약 날짜 선택"
            />
            <View style={{ position: 'absolute', right: 32, top: 30 }}>
                <ReservationTypeTable />
            </View>

            <View style={{ marginTop: 88, flex: 1 }}>

                <FullCalendar
                    onClickDate={(date) => {
                        const dateString = date.toISOString().split('T')[0];
                        setDate(dateString);
                        navigation.push('EditReservationTimeSelect');
                    }}

                    {...calendarProps}
                />

            </View>

        </View>
    )
}

export default DateSelcectScreen

const styles = StyleSheet.create({})