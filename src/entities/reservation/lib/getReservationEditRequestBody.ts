
import { isEqual } from "lodash";
import type { ReservationForm } from "../model/type";
import type { Instrument } from "@hongpung/src/entities/instrument";
import type { Member } from "@hongpung/src/entities/member";
import type { ReservationEditRequestBody } from "../api/type";


/**
 * 두 예약 간의 차이점을 RequestBody로 반환합니다.
 */
export function getReservationEditRequestBody(preReservation: ReservationForm & { reservationId: number }, newReservation: ReservationForm): ReservationEditRequestBody & { reservationId: number } {

    if (!preReservation.reservationId) throw Error('예약 정보가 없습니다.')

    const differences: Partial<ReservationEditRequestBody> = {};

    Object.keys(newReservation).forEach(key => {

        const typedKey = key as keyof ReservationForm;

        const oldValue = preReservation[typedKey];
        const newValue = newReservation[typedKey];

        if (!!oldValue && !!newValue) {

            if (!isEqual(oldValue, newValue)) {

                if (typedKey === 'participators') {

                    const oldParticipatorIds = (oldValue as Member[]).map((item) => item.memberId);
                    const newParticipatorIds = (newValue as Member[]).map((item) => item.memberId);

                    const added = newParticipatorIds.filter((item: number) => !oldParticipatorIds.includes(item));
                    const removed = oldParticipatorIds.filter((item: number) => !newParticipatorIds.includes(item));

                    if (added.length > 0) differences['addedParticipatorIds'] = added;
                    if (removed.length > 0) differences['removedParticipatorIds'] = removed;

                }
                else if (typedKey == 'borrowInstruments') {

                    const oldParticipatorIds = (oldValue as Instrument[]).map((item) => item.instrumentId);
                    const newParticipatorIds = (newValue as Instrument[]).map((item) => item.instrumentId);

                    const added = newParticipatorIds.filter((item: number) => !oldParticipatorIds.includes(item));
                    const removed = oldParticipatorIds.filter((item: number) => !newParticipatorIds.includes(item));

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
        }
    });

    return { ...differences, reservationId: preReservation.reservationId };

}

