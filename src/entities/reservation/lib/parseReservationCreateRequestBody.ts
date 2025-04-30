import type { ReservationForm } from "../model/type";
import type { ReservationCreateRequestBody } from "../api/type";

export const parseReservationCreateRequestBody = ({ participators, borrowInstruments, reservationType, ...reservation }: Required<ReservationForm>): ReservationCreateRequestBody => {
    return {
        ...reservation,
        reservationType: reservationType as Exclude<ReservationType, "EXTERNAL">,
        participatorIds: participators.map(user => user.memberId),
        borrowInstrumentIds: borrowInstruments.map(instrument => instrument.instrumentId)
    };

}