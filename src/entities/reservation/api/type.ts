import { TimeFormat } from "@hongpung/src/common"
import { Instrument } from "../@x/instrument"
import { User } from "../@x/user"


export type ReservationDto = {
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


export interface ReservationCreateRequestBody {

    title: string // 예약 제목

    date: string // 예약 날짜 yyyy-mm-dd 형식

    startTime: string // 시작 시간 hh:mm 형식
    endTime: string // 시작 시간 hh:mm 형식

    reservationType: Exclude<ReservationType, 'EXTERNAL'>  // 예약 유형 변환

    participationAvailable: boolean

    participatorIds: number[]

    borrowInstrumentIds: number[]

}

export interface ReservationEditRequestBody extends Omit<ReservationCreateRequestBody, 'borrowInstrumentIds' | 'participatorIds'> {

    reservationId: number

    addedParticipatorIds?: number[]
    removedParticipatorIds?: number[]

    addedBorrowInstrumentIds?: number[]
    removedBorrowInstrumentIds?: number[]

}

export type ExistReservationDto = {

    reservationId: number;

    startTime: TimeFormat;

    endTime: TimeFormat;

    reservationType: ReservationType;

}