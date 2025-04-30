import React from 'react'

import { StyleSheet, Text, View } from 'react-native'

import ReservationTypeTable from '@hongpung/src/entities/reservation/ui/ReservationTypeTable';

import { useCreateReservation } from '@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context';
import { FullCalendar } from '@hongpung/src/widgets/reservation/ui/FullCalendar/FullCalendar';
import { useReservationCalendar } from '@hongpung/src/features/reservation/configureReservation/model/useReservationCalendar';
import { CreateReservationStackScreenProps } from '@hongpung/src/common/navigation/createReservation';
import { Header } from '@hongpung/src/common';



const CreateReservationDateSelectScreen: React.FC<CreateReservationStackScreenProps<"CreateReservationDateSelect">> = ({ navigation }) => {

    const { reservation, setDate } = useCreateReservation();
    const calendarProps = useReservationCalendar(reservation.date);

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <Header
                leftButton="close"
                headerName={"날짜 선택"}
            />
            <View style={{ position: 'absolute', right: 32, top: 84 }}>
                <ReservationTypeTable />
            </View>

            <View style={{ marginTop: 88, flex: 1 }}>

                <FullCalendar
                    onClickDate={(date) => {
                        const dateString = date.toISOString().split('T')[0];
                        setDate(dateString);
                        navigation.navigate("CreateReservationTimeSelect");
                    }}

                    {...calendarProps}
                />

            </View>

        </View>
    )
}

export default CreateReservationDateSelectScreen