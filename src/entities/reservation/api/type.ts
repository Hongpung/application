import { TimeFormat } from "@hongpung/src/common"
import { Instrument } from "@hongpung/src/entities/instrument/@x/reservation"
import { User } from "@hongpung/src/entities/member/@x/reservation"


export type ReservationDto = {
    reservationId?: number

    title: string // 예약 제목

    date: string // 예약 날짜 yyyy-mm-dd 형식

    startTime: string // 시작 시간 hh:mm 형식
    endTime: string // 시작 시간 hh:mm 형식

    creatorId?: number;
    creatorName: string;
    creatorNickname?: string;

    reservationType: Exclude<ReservationType, "EXTERNAL">

    participationAvailable: boolean

    participators: User[]

    borrowInstruments: Instrument[]
}|{
    reservationId?: number

    title: string // 예약 제목

    date: string // 예약 날짜 yyyy-mm-dd 형식

    startTime: string // 시작 시간 hh:mm 형식
    endTime: string // 시작 시간 hh:mm 형식

   
    creatorName: string;

    reservationType: "EXTERNAL"

    participationAvailable: boolean

}



export interface MonthlyReservationDto {

    reservationId: number;

    date: string;

    reservationType: ReservationType;

    participationAvailable: boolean;

}

//일간 조회
export interface DailyReservationDto {

    reservationId: number;

    date: string;

    startTime: string;
    endTime: string;

    title: string;

    amountOfParticipators: number;

    creatorName: string;

    creatorNickname?: string;

    reservationType: ReservationType;

    participationAvailable: boolean;
}




export type ExistReservationDto = {

    reservationId: number;

    startTime: TimeFormat;

    endTime: TimeFormat;

    reservationType: ReservationType;

}