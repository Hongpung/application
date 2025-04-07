import React from 'react'

import { StyleSheet, Text, View } from 'react-native'

import { Color } from '@hongpung/ColorSet';
import { useCreateReservation } from '@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context';
import { FullCalendar } from '@hongpung/src/widgets/reservation/ui/FullCalendar/FullCalendar';


const DateSelcectScreen: React.FC = () => {

    const { reservation, setDate } = useCreateReservation();

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>

            <View style={{ position: 'absolute', right: 32, top: 30, flexDirection: 'column', gap: 4 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <View style={{ backgroundColor: Color['blue500'], height: 4, width: 20, borderRadius: 5, marginRight: 8 }} />

                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>정규 일정</Text>

                </View>

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

                <FullCalendar

                    initialDate={reservation.date ? new Date(reservation.date) : undefined}

                    onClickDate={(date) => {
                        const dateString = date.toISOString().split('T')[0];
                        setDate(dateString);
                    }}

                />
                
            </View>

        </View>
    )
}

export default DateSelcectScreen

const styles = StyleSheet.create({})