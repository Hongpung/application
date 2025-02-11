import { User, InstrumentWithOutBorrowHistory } from '@hongpung/UserType'

export type reservationType = "REGULAR" | "COMMON" | "EXTERNAL"

export interface Reservation {
    reservationId?: number
    date?: Date
    Time: { startTime: string, endTime: string }
    reservationName: string
    reservationType: reservationType
    isRegular: boolean
    isParticipatible: boolean
    participators: User[]
    borrowInstruments: InstrumentWithOutBorrowHistory[]
    hasToWait: boolean
    creatorId?: number
    userName: string
    userNickname?: string
    lastmodified?: Date
    [key: string]: any
};

export function areReservationsEqual(r1: Reservation, r2: Reservation): boolean {
    return JSON.stringify(r1) === JSON.stringify(r2);
}

/**
 * 두 객체가 깊은 비교를 통해 동일한지 확인하는 함수
 *
 * @param obj1 - 비교할 첫 번째 객체
 * @param obj2 - 비교할 두 번째 객체
 * @returns 두 객체가 동일하면 true, 그렇지 않으면 false
 *
 * @remarks
 * 이 함수는 두 객체를 재귀적으로 비교하여 모든 속성과 값을 확인합니다.
 * Date 객체와 배열도 지원합니다.
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


/**
 * 두 예약 객체 간의 차이점을 찾아 반환합니다.
 *
 * @param preReservation - 이전 예약 객체
 * @param newReservation - 새로운 예약 객체
 * @returns 차이점이 있는 필드와 그 값을 포함하는 객체
 *
 * @remarks
 * 이 함수는 두 예약 객체를 비교하여 차이점을 찾고, 차이점이 있는 필드를 반환합니다.
 * 특히 `participaterIds`와 `borrowInstrumentIds` 필드의 경우 추가된 항목과 제거된 항목을 별도로 반환합니다.
 *
 * @example
 * ```typescript
 * const preReservation = { ... };
 * const newReservation = { ... };
 * const differences = findReservationDifferences(preReservation, newReservation);
 * console.log(differences);
 * ```
 */
export function findReservationDifferences(preReservation: Reservation, newReservation: Reservation): Partial<ReservationSubmitForm | any> {
    const differences: Partial<ReservationSubmitForm | any> = {};
    const preResevationForm = parseToReservationForm(preReservation)
    const newResevationForm = parseToReservationForm(newReservation)

    Object.keys(preResevationForm).forEach((key) => {
        const oldValue = (preResevationForm as any)[key];
        const newValue = (newResevationForm as any)[key];

        if (!deepEqual(oldValue, newValue)) {
            if (key as keyof ReservationSubmitForm == 'participaterIds') {
                console.log(oldValue, newValue)
                const added = newValue.filter((item: number) => !oldValue.includes(item));
                const removed = oldValue.filter((item: number) => !newValue.includes(item));

                console.log(added, removed, 'ww')
                if (added.length > 0) differences['addedParticipatorIds'] = added;
                if (removed.length > 0) differences['removedParticipatorIds'] = removed;

            }
            else if (key as keyof ReservationSubmitForm == 'borrowInstrumentIds') {
                console.log(oldValue, newValue)
                const added = newValue.filter((item: number) => !oldValue.includes(item));
                const removed = oldValue.filter((item: number) => !newValue.includes(item));

                console.log(added, removed, 'ww')
                if (added.length > 0) differences['addedBorrowInstrumentIds'] = added;
                if (removed.length > 0) differences['removedBorrowInstrumentIds'] = removed;

            }
            else
                differences[key as keyof ReservationSubmitForm] = newValue as any;
        }
    });
    return differences;
}


/**
 * 예약 DTO 인터페이스
 * ReservationSubmitForm에서 'participaterIds'와 'borrowInstrumentIds'를 제외한 필드를 포함합니다.
 */
export interface ReservationDTO extends Omit<ReservationSubmitForm, 'participaterIds' | 'borrowInstrumentIds'> {
    reservationId?: number;            // 예약 ID
    creatorId?: number;                // 생성자 ID
    creatorName: string;               // 생성자 이름
    creatorNickname?: string;          // 생성자 닉네임
    lastmodified: string;              // 마지막 수정 날짜 (ISO 형식)
    participators: User[];             // 참여자 목록
    borrowInstruments: InstrumentWithOutBorrowHistory[]; // 대여 악기 목록
    [key: string]: any;
}

/**
 * 예약 제출 폼 인터페이스
 */
export interface ReservationSubmitForm {
    date: string;                     // 예약 날짜 (YYYY-MM-DD 형식)
    startTime: string;                // 시작 시간 (HH:MM:SS 형식)
    endTime: string;                  // 종료 시간 (HH:MM:SS 형식)
    title: string;                    // 예약 메시지 또는 설명
    reservationType: string;          // 예약 유형 (정기연습, 특별행사 등)
    participationAvailable: boolean;  // 참여 가능 여부
    participatorIds: number[];        // 참여자 목록
    borrowInstrumentIds?: number[];   // 대여 악기 목록
    [key: string]: any;
}

/**
 * 예약 객체를 ReservationDTO로 변환하는 함수
 *
 * @param reservation - 예약 객체
 * @param user - 사용자 객체
 * @returns ReservationDTO 객체
 */
export const parseToReservationDetail = (reservation: Reservation, user: User): ReservationDTO => {
    return {
        creatorName: user.name,
        email: user.email,  // Reservation 타입에는 없는 필드
        date: reservation.date!.toISOString().split("T")[0],  // `Date` 객체를 `YYYY-MM-DD` 형식으로 변환
        type: reservation.isRegular ? "REGULAR" : "COMMON",  // 예약 유형 변환
        startTime: reservation.Time.startTime,  // Enum -> HH:MM:SS 변환
        endTime: reservation.Time.endTime,      // Enum -> HH:MM:SS 변환
        title: reservation.reservationName,  // 필요시 채워야 함
        participationAvailable: reservation.isParticipatible,
        lastmodified: new Date().toISOString(),  // 현재 시각을 ISO 형식으로 설정
        participators: reservation.participators,
        borrowInstruments: reservation.borrowInstruments
    };
}

/**
 * 예약 객체를 ReservationSubmitForm으로 변환하는 함수
 *
 * @param reservation - 예약 객체
 * @returns ReservationSubmitForm 객체
 */
export const parseToReservationForm = (reservation: Reservation): ReservationSubmitForm => {
    const startTime = reservation.Time.startTime.slice(-4, -2) + ':' + reservation.Time.startTime.slice(-2);
    const endTime = reservation.Time.endTime.slice(-4, -2) + ':' + reservation.Time.endTime.slice(-2);
    return {
        date: reservation.date!.toISOString().split("T")[0],  // `Date` 객체를 `YYYY-MM-DD` 형식으로 변환
        reservationType: reservation.isRegular ? "REGULAR" : "COMMON",  // 예약 유형 변환
        startTime,  // Enum -> HH:MM:SS 변환
        endTime,    // Enum -> HH:MM:SS 변환
        title: reservation.reservationName,  // 필요시 채워야 함
        participationAvailable: reservation.isParticipatible,
        participatorIds: reservation.participators.map(user => user.memberId),
        borrowInstrumentIds: reservation.borrowInstruments.map(instrument => instrument.instrumentId)
    };
}

/**
 * ReservationDTO를 Reservation 객체로 변환하는 함수
 *
 * @param reservationDTO - ReservationDTO 객체
 * @returns Reservation 객체
 */
export function parseToReservation(reservationDTO: ReservationDTO): Reservation {
    const [startHour, startMinnute] = reservationDTO.startTime.split(':');
    const [endHour, endMinnute] = reservationDTO.endTime.split(':');
    return {
        reservationId: reservationDTO.reservationId,
        creatorId: reservationDTO.creatorId,
        userName: reservationDTO.creatorName,
        userNickname: reservationDTO.creatorNickname,
        reservationType: reservationDTO.reservationType,
        date: new Date(reservationDTO.date), // `YYYY-MM-DD` 형식을 `Date` 객체로 변환
        Time: {
            startTime: `TIME_${startHour}${startMinnute}`,  // `HH:MM:SS`를 분 단위 숫자로 변환
            endTime: `TIME_${endHour}${endMinnute}`,
        },
        reservationName: reservationDTO.title,  // 생성자 이름을 예약 이름으로 사용
        isRegular: reservationDTO.type === "정규연습",  // `type`에 따라 정기 예약 여부 판단
        isParticipatible: reservationDTO.participationAvailable,  // 참여 가능 여부 매핑
        participators: reservationDTO.participators?.filter(user => user.memberId != reservationDTO.creatorId) ?? [],  // creator를 제외하고 매핑
        borrowInstruments: reservationDTO?.borrowedInstruments ?? [],  // 사용 중인 악기 정보는 기본적으로 빈 배열로 설정 (필요시 추가)
        hasToWait: false,  // 대기 여부는 기본적으로 false로 설정 (필요시 추가 로직)
        lastmodified: new Date(reservationDTO.lastmodified)
    };
}