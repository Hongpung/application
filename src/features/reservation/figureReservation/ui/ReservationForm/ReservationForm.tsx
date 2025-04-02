import { View } from 'react-native'
import React, { useCallback } from 'react'
import { TitleInput } from '@hongpung/src/features/reservation/figureReservation/ui/TitleInput/TitleInput'

import { ReservationTypeSelector } from '../ReservationTypeSelector/ReservationTypeSelector'
import { ParticipatorsSelector } from '../ParticipatorsSelector/ParticipatorsSelector'
import { BorrowInstrumentsSelector } from '../BorrowInstrumentsSelector/BorrowInstrumentsSelector'

import { type ReservationForm as ReservationFormType } from '../../../model/type'
import { DateTimeSelector } from '../DateTimeSelector/DateTimeSelector'


type ReservationFormProps = {
    reservation: ReservationFormType;

    setTitle: (title: string) => void;

    setParticipationAvailable: (available: boolean) => void;
    setReservationType: (type: Exclude<ReservationType, 'EXTERNAL'>) => void;

    resetParticipators: () => void;
    resetBorrowInstruments: () => void;

    navigateToParticipatorsPickerPage: () => void;
    navigateToBorrowInstruemntPickerPage: () => void;

    navigateDatePickerPage: () => void;
    navigateTimePickerPage: () => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = (props) => {

    const {
        reservation,
        setTitle,
        setParticipationAvailable,
        setReservationType,
        resetParticipators,
        resetBorrowInstruments,
        navigateDatePickerPage,
        navigateTimePickerPage,
        navigateToParticipatorsPickerPage,
        navigateToBorrowInstruemntPickerPage
    } = props

    const { startTime, endTime, title, participationAvailable, reservationType, participators, borrowInstruments, date } = reservation;

    const onDateTimePress = useCallback(() => {
        if (!date)
            navigateDatePickerPage();
        else
            navigateTimePickerPage();
    }, [])

    return (

        <View>

            <DateTimeSelector
                date={date}
                startTime={startTime}
                endTime={endTime}
                onPress={onDateTimePress}
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
                onPress={navigateToParticipatorsPickerPage}
                participators={participators}
                resetParticipator={resetParticipators}
            />

            <BorrowInstrumentsSelector
                onPress={navigateToBorrowInstruemntPickerPage}
                borrowInstruments={borrowInstruments}
                resetBorrowInstruments={resetBorrowInstruments}
            />

        </View>

    )
}