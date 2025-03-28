import { ReservationDetail } from "../model/type";

import { ReservationEditRequestBody, ReservationCreateRequestBody } from '../api/type'
import { mapReservationCreateRequestBody } from "./mapReservationCreateBody";

import { isEqual } from "lodash";


/**
 * 두 예약 간의 차이점을 찾아 반환합니다.
 */

export function getReservationEditRequestBody(preReservation: ReservationDetail, newReservation: ReservationDetail): Partial<ReservationEditRequestBody> & { reservationId: number } {

    if (!preReservation.reservationId) throw Error('예약 정보가 없습니다.')

    const differences: Partial<ReservationEditRequestBody> = {};

    const preReservationForm = mapReservationCreateRequestBody(preReservation);
    const newReservationForm = mapReservationCreateRequestBody(newReservation);

    Object.keys(preReservationForm).forEach(key => {

        const typedKey = key as keyof ReservationCreateRequestBody;

        const oldValue = preReservationForm[typedKey];
        const newValue = newReservationForm[typedKey];

        if (!!oldValue && !!newValue)
            if (!isEqual(oldValue, newValue)) {
                if (typedKey === 'participatorIds') {

                    const added = (newValue as number[]).filter((item: number) => !(oldValue as number[]).includes(item));
                    const removed = (oldValue as number[]).filter((item: number) => !(newValue as number[]).includes(item));

                    if (added.length > 0) differences['addedParticipatorIds'] = added;
                    if (removed.length > 0) differences['removedParticipatorIds'] = removed;

                }
                else if (typedKey == 'borrowInstrumentIds') {

                    const added = (newValue as number[]).filter((item: number) => !(oldValue as number[]).includes(item));
                    const removed = (oldValue as number[]).filter((item: number) => !(newValue as number[]).includes(item));

                    if (added.length > 0) differences['addedBorrowInstrumentIds'] = added;
                    if (removed.length > 0) differences['removedBorrowInstrumentIds'] = removed;

                }
                else if (typedKey == 'participationAvailable')
                    differences[typedKey] = newValue as boolean;
                else if (typedKey == 'reservationType')
                    differences[typedKey] = newValue as Exclude<ReservationType, 'EXTERNAL'>;
                else
                    differences[typedKey] = newValue as string;
            }
    });

    return { ...differences, reservationId: preReservation.reservationId };

}

