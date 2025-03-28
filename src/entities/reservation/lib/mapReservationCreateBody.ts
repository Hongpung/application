import { ReservationDetail } from "../model/type";
import { ReservationCreateRequestBody } from "../api/type";

/**
 * ReservationDto를 ReservationSubmitForm으로 변환하는 함수
 */
export const mapReservationCreateRequestBody = ({ participators, borrowInstruments, reservationType, ...reservation }: ReservationDetail): ReservationCreateRequestBody => {
    return {
        ...reservation,
        reservationType: reservationType as Exclude<ReservationType, "EXTERNAL">,
        participatorIds: participators.map(user => user.memberId),
        borrowInstrumentIds: borrowInstruments.map(instrument => instrument.instrumentId)
    };
}