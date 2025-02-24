import { ReservationClientDTO, ReservationEditForm, ReservationSubmitForm, ReservationType, parseToReservationForm } from "@hongpung/src/entities/reservation";

/**
 * 두 예약 간의 차이점을 찾아 반환합니다.
 */
export function findReservationDiff(preReservation: ReservationClientDTO, newReservation: ReservationClientDTO): Partial<ReservationEditForm> {

    const differences: Partial<ReservationEditForm> = {};

    const preReservationForm = parseToReservationForm(preReservation)
    const newReservationForm = parseToReservationForm(newReservation)

    Object.keys(preReservationForm).forEach(key => {

        const typedKey = key as keyof ReservationSubmitForm;

        const oldValue = preReservationForm[typedKey];
        const newValue = newReservationForm[typedKey];

        if (!!oldValue && !!newValue)
            if (!deepEqual(oldValue, newValue)) {
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
    return differences;
}


/**
 * 깊은 비교를 통해 두 자료가 동일한지 확인하는 함수
 */
function deepEqual(obj1: any, obj2: any): boolean {

    if (obj1 === obj2) return true; // 값이 같으면 true 반환
    if (typeof obj1 !== typeof obj2) return false; // 타입이 다르면 false
    if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) return false; // 객체가 아니거나 null인 경우

    // Date 객체의 경우 getTime()으로 비교
    if (obj1 instanceof Date && obj2 instanceof Date) {
        return obj1.getTime() === obj2.getTime();
    }

    // 배열인 경우, 각 요소를 비교
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false;
        return obj1.every((item, index) => deepEqual(item, obj2[index]));
    }

    // 객체의 모든 키를 비교
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;

    // 각 키에 대해 재귀적으로 비교
    return keys1.every((key) => deepEqual(obj1[key], obj2[key]));
}