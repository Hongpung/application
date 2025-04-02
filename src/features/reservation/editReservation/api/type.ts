
export interface ReservationEditRequestBody {

    reservationId: number

    title?: string // 예약 제목

    date?: string // 예약 날짜 yyyy-mm-dd 형식

    startTime?: string // 시작 시간 hh:mm 형식
    endTime?: string // 시작 시간 hh:mm 형식

    reservationType?: Exclude<ReservationType, 'EXTERNAL'>  // 예약 유형 변환

    participationAvailable?: boolean

    addedParticipatorIds?: number[]
    removedParticipatorIds?: number[]

    addedBorrowInstrumentIds?: number[]
    removedBorrowInstrumentIds?: number[]

}