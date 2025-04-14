import React, { useCallback } from 'react'
import { TitleInput } from '@hongpung/src/features/reservation/configureReservation/ui/TitleInput/TitleInput'

import { ReservationTypeSelector } from '@hongpung/src/features/reservation/configureReservation/ui/ReservationTypeSelector/ReservationTypeSelector'
import { ParticipatorsSelector } from '@hongpung/src/features/reservation/configureReservation/ui/ParticipatorsSelector/ParticipatorsSelector'
import BorrowInstrumentsSelector from '@hongpung/src/features/reservation/configureReservation/ui/BorrowInstrumentsSelector/BorrowInstrumentsSelector'

import { type ReservationForm as ReservationFormType } from '@hongpung/src/features/reservation/model/type'
import { DateTimeSelector } from '@hongpung/src/features/reservation/configureReservation/ui/DateTimeSelector/DateTimeSelector'


type ReservationFormProps = {
    reservation: ReservationFormType;

    setTitle: (title: string) => void;

    setParticipationAvailable: (available: boolean) => void;
    setReservationType: (type: Exclude<ReservationType, 'EXTERNAL'>) => void;

    resetParticipators: () => void;
    resetBorrowInstruments: () => void;

    navigateToParticipatorsPickerPage: () => void;
    navigateToBorrowInstrumentsPickerPage: () => void;

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
        navigateToBorrowInstrumentsPickerPage

    } = props


    const { startTime, endTime, title, participationAvailable, reservationType, participators, borrowInstruments, date } = reservation;



    const onDateTimePress = useCallback(() => {
        if (!date) {
            navigateDatePickerPage();
        }
        else {
            navigateTimePickerPage();
        }
    }, [])


    return (

        <>

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
                onPress={navigateToBorrowInstrumentsPickerPage}
                borrowInstruments={borrowInstruments}
                resetBorrowInstruments={resetBorrowInstruments}
            />

        </>

    )
}