import { selector, DefaultValue } from "recoil";

import { titleState, dateState, startTimeState, endTimeState, reservationTypeState, participationAvailableState, participatorsState, borrowInstrumentsState } from "./reservationFormState";

import { ReservationForm } from "./type";

export const reservationFormState = selector<ReservationForm>({
    key: 'reservationForm',
    get: ({ get }) => {
        const title = get(titleState);
        const date = get(dateState);
        const startTime = get(startTimeState);
        const endTime = get(endTimeState);
        const reservationType = get(reservationTypeState);
        const participationAvailable = get(participationAvailableState);
        const participators = get(participatorsState);
        const borrowInstruments = get(borrowInstrumentsState);

        return {
            title,
            date,
            startTime,
            endTime,
            reservationType,
            participationAvailable,
            participators,
            borrowInstruments,
        };
    },
    set: ({ set, reset }, newReservationData) => {
        if ((newReservationData instanceof DefaultValue)) {
            reset(titleState);
            reset(dateState);
            reset(startTimeState);
            reset(endTimeState);
            reset(reservationTypeState);
            reset(participationAvailableState);
            reset(participatorsState);
            reset(borrowInstrumentsState);
        }
        else {
            set(titleState, newReservationData.title);
            set(dateState, newReservationData.date);
            set(startTimeState, newReservationData.startTime);
            set(endTimeState, newReservationData.endTime);
            set(reservationTypeState, newReservationData.reservationType);
            set(participationAvailableState, newReservationData.participationAvailable);
            set(participatorsState, newReservationData.participators);
            set(borrowInstrumentsState, newReservationData.borrowInstruments);
        }
    },
});