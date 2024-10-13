import { loginUserState } from '@hongpung/recoil/authState'
import { User, Instrument, briefInstrument } from '@hongpung/UserType'
import { useRecoilValue } from 'recoil'

export interface Reservation {
    reservationId?: number
    date?: Date
    Time: { startTime: string, endTime: string }
    reservationName: string
    isRegular: boolean
    isParticipatible: boolean
    participants: User[]
    borrowInstruments: briefInstrument[]
    hasToWait: boolean
    userEmail: string
    userName: string
    lastmodified?: Date
};

export function areReservationsEqual(r1: Reservation, r2: Reservation): boolean {
    return JSON.stringify(r1) === JSON.stringify(r2);
}

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

export function findReservationDifferences(preReservation: Reservation, newReservation: Reservation): Partial<ReservationSubmitForm|any> {
    const differences: Partial<ReservationSubmitForm|any> = {};
    const preResevationForm = parseToReservationForm(preReservation)
    const newResevationForm = parseToReservationForm(newReservation)

    Object.keys(preResevationForm).forEach((key) => {
        const oldValue = (preResevationForm as any)[key];
        const newValue = (newResevationForm as any)[key];

        if (!deepEqual(oldValue, newValue)) {
            if (key as keyof ReservationSubmitForm == 'participaterIds') {
                console.log(oldValue,newValue)
                const added =  newValue.filter((item:number) => !oldValue.includes(item));
                const removed = oldValue.filter((item:number) => !newValue.includes(item));
                
                console.log(added,removed,'ww')
                if(added.length>0) differences['addedParticipatorIds'] = added;
                if(removed.length>0)differences['removedParticipatorIds'] = removed;

            }
            else
            differences[key as keyof ReservationSubmitForm] = newValue as any;
        }
    });
    return differences;
}


export interface ReservationDTO extends Omit<ReservationSubmitForm, 'participaterIds'> {
    reservationId?: number;            // 예약 ID
    creatorName: string;              // 생성자 이름
    email: string;                    // 생성자 이메일
    lastmodified: string;             // 마지막 수정 날짜 (ISO 형식)
    participators: User[]
}

export interface ReservationSubmitForm {
    date: string;                     // 예약 날짜 (YYYY-MM-DD 형식)
    startTime: string;                // 시작 시간 (HH:MM:SS 형식)
    endTime: string;                  // 종료 시간 (HH:MM:SS 형식)
    message: string;                  // 예약 메시지 또는 설명
    type: string;                     // 예약 유형 (정기연습, 특별행사 등)
    participationAvailable: boolean;  // 참여 가능 여부
    participaterIds: number[];    // 참여자 목록 (Participator 배열)
}

export const parseToReservationDetail = (reservation: Reservation, user: User): ReservationDTO => {
    return {
        creatorName: user.name,
        email: user.email,  // Reservation 타입에는 없는 필드
        date: reservation.date!.toISOString().split("T")[0],  // `Date` 객체를 `YYYY-MM-DD` 형식으로 변환
        type: reservation.isRegular ? "FIXED_TIME" : "NOT_FIXED_TIME",  // 예약 유형 변환
        startTime: reservation.Time.startTime,  // Enum -> HH:MM:SS 변환
        endTime: reservation.Time.endTime,      // Enum -> HH:MM:SS 변환
        message: reservation.reservationName,  // 필요시 채워야 함
        participationAvailable: reservation.isParticipatible,
        lastmodified: new Date().toISOString(),  // 현재 시각을 ISO 형식으로 설정
        participators: reservation.participants,
    };
}

export const parseToReservationForm = (reservation: Reservation): ReservationSubmitForm => {
    return {
        date: reservation.date!.toISOString().split("T")[0],  // `Date` 객체를 `YYYY-MM-DD` 형식으로 변환
        type: reservation.isRegular ? "FIXED_TIME" : "NOT_FIXED_TIME",  // 예약 유형 변환
        startTime: reservation.Time.startTime,  // Enum -> HH:MM:SS 변환
        endTime: reservation.Time.endTime,      // Enum -> HH:MM:SS 변환
        message: reservation.reservationName,  // 필요시 채워야 함
        participationAvailable: reservation.isParticipatible,
        participaterIds: reservation.participants.map(user => user.memberId),
    };
}

// ReservationDetail -> Reservation 변환 함수
export function parseToReservation(reservationDTO: ReservationDTO): Reservation {

    const [startHour, startMinnute] = reservationDTO.startTime.split(':')
    const [endHour, endMinnute] = reservationDTO.endTime.split(':')
    return {
        reservationId: reservationDTO?.reservationId,
        userName: reservationDTO.creatorName,
        userEmail: reservationDTO.email,
        date: new Date(reservationDTO.date), // `YYYY-MM-DD` 형식을 `Date` 객체로 변환
        Time: {
            startTime: `TIME_${startHour}${startMinnute}`,  // `HH:MM:SS`를 분 단위 숫자로 변환
            endTime: `TIME_${endHour}${endMinnute}`,
        },
        reservationName: reservationDTO.message,  // 생성자 이름을 예약 이름으로 사용
        isRegular: reservationDTO.type === "정기연습",  // `type`에 따라 정기 예약 여부 판단
        isParticipatible: reservationDTO.participationAvailable,  // 참여 가능 여부 매핑
        participants: reservationDTO.participators?.filter(user => user.email != reservationDTO.email) ?? [],  // 참여자 목록 그대로 매핑
        borrowInstruments: [],  // 사용 중인 악기 정보는 기본적으로 빈 배열로 설정 (필요시 추가)
        hasToWait: false,  // 대기 여부는 기본적으로 false로 설정 (필요시 추가 로직)
        lastmodified: new Date(reservationDTO.lastmodified)
    };
}