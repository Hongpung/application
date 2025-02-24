import { ReservationClientDTO, ReservationSubmitForm } from "./reservation-dto";

/**
 * ReservationDto를 ReservationSubmitForm으로 변환하는 함수
 */
export const parseToReservationForm = ({ participators, borrowInstruments, ...reservation }: ReservationClientDTO): ReservationSubmitForm => {
    return {
        ...reservation,
        participatorIds: participators.map(user => user.memberId),
        borrowInstrumentIds: borrowInstruments.map(instrument => instrument.instrumentId)
    };
}