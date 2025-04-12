import { TimeFormat } from "@hongpung/src/common"
import { Instrument } from "@hongpung/src/entities/instrument"
import { Member } from "@hongpung/src/entities/member"

export type ReservationForm = {

    title: string // 예약 제목

    date?: string // 예약 날짜 yyyy-mm-dd 형식

    startTime?: TimeFormat// 시작 시간 hh:mm 형식
    endTime?: TimeFormat// 시작 시간 hh:mm 형식

    reservationType: Exclude<ReservationType, 'EXTERNAL'>

    participationAvailable: boolean

    participators: Member[]

    borrowInstruments: Instrument[]

}
