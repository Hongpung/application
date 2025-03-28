import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { DateTimeDisplay } from '../../../entities/reservation/ui/DateTimeSelector/DateTimeSelector'
import { TitleInput } from '../../../entities/reservation/ui/TitleInput/TitleInput'
import { ReservationTypeSelector } from '../../../entities/reservation/ui/ReservationTimeSelector/ReservationTimeSelector'
import { ParticipatorsSelector } from '../../../entities/reservation/ui/ParticipatorsSelector/ParticipatorsSelector'
import { BorrowInstrumentsSelector } from '../../../entities/reservation/ui/BorrowInstrumentsSelector/BorrowInstrumentsSelector'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { borrowInstrumentsState, dateState, endTimeState, participationAvailableState, participatorsState, reservationTypeState, startTimeState, titleState } from '../model/reservationFormState'


export const ReservationForm = () => {


    const date = useRecoilValue(dateState)
    const startTime = useRecoilValue(startTimeState)
    const endTime = useRecoilValue(endTimeState)

    const [title, setTitle] = useRecoilState(titleState)
    const [participationAvailable, setParticipationAvailable] = useRecoilState(participationAvailableState)
    const [reservationType, setReservationType] = useRecoilState(reservationTypeState)

    const participators = useRecoilValue(participatorsState)
    const resetParticipator = useResetRecoilState(participatorsState)

    const borrowInstruments = useRecoilValue(borrowInstrumentsState)
    const resetBorrowInstruments = useResetRecoilState(borrowInstrumentsState)

    return (

        <View>

            <DateTimeDisplay
                date={date}
                startTime={startTime}
                endTime={endTime}
                onPress={() => { }}
                as={Pressable}
            />

            <TitleInput
                title={title}
                setTitle={setTitle}
            />

            <ReservationTypeSelector
                participationAvailable={participationAvailable}
                reservationType={reservationType}
                setParticipationAvailable={setParticipationAvailable}
                setReservationType={setReservationType}
            />

            <ParticipatorsSelector
                onPress={() => { }}
                participators={participators}
                resetParticipator={resetParticipator}
            />

            <BorrowInstrumentsSelector
                onPress={() => { }}
                borrowInstruments={borrowInstruments}
                resetBorrowInstruments={resetBorrowInstruments}
            />

        </View>

    )
}