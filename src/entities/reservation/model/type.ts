import { type User } from "@hongpung/src/entities/member/@x/reservation"
import { Instrument } from "../../instrument/@x/reservation"

export interface ReservationDetail {

    reservationId?: number

    title: string // 예약 제목

    date: string // 예약 날짜 yyyy-mm-dd 형식

    startTime: string // 시작 시간 hh:mm 형식
    endTime: string // 시작 시간 hh:mm 형식

    creatorId?: number;
    creatorName: string;
    creatorNickname?: string;

    reservationType: ReservationType

    participationAvailable: boolean

    participators: User[]

    borrowInstruments: Instrument[]
    
}

export interface DailyReservation {

    reservationId: number

    title: string // 예약 제목

    date: string // 예약 날짜 yyyy-mm-dd 형식

    startTime: string // 시작 시간 hh:mm 형식
    endTime: string // 시작 시간 hh:mm 형식

    reservationType: ReservationType;
    
    participationAvailable: boolean;
    
    creatorName: string;
    
    creatorNickname?: string;
    
    amountOfParticipators: number;
}