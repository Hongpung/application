import { type Member } from "@hongpung/src/entities/member/@x/reservation";
import { Instrument } from "../../instrument/@x/reservation";
import { TimeFormat } from "@hongpung/src/common";

export interface Reservation {
  reservationId: number;
  date: string;
  startTime: string;
  endTime: string;

  title: string;

  creatorId?: number;
  creatorName: string;
  creatorNickname?: string;

  reservationType: ReservationType;
  participationAvailable: boolean;

  amountOfParticipators: number;
}

export type ReservationDetail =
  | {
      reservationId?: number;

      title: string; // 예약 제목

      date: string; // 예약 날짜 yyyy-mm-dd 형식

      startTime: string; // 시작 시간 hh:mm 형식
      endTime: string; // 시작 시간 hh:mm 형식

      creatorId?: number;
      creatorName: string;
      creatorNickname?: string;

      reservationType: Exclude<ReservationType, "EXTERNAL">;

      participationAvailable: boolean;

      participators: Member[];

      borrowInstruments: Instrument[];
    }
  | {
      reservationId?: number;
      title: string; // 예약 제목

      date: string; // 예약 날짜 yyyy-mm-dd 형식

      startTime: string; // 시작 시간 hh:mm 형식
      endTime: string; // 시작 시간 hh:mm 형식

      creatorName: string;

      reservationType: "EXTERNAL";
      participationAvailable: boolean;
    };

    
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


export interface DailyReservation {
  reservationId: number;

  title: string; // 예약 제목

  date: string; // 예약 날짜 yyyy-mm-dd 형식

  startTime: string; // 시작 시간 hh:mm 형식
  endTime: string; // 시작 시간 hh:mm 형식

  reservationType: ReservationType;

  participationAvailable: boolean;

  creatorName: string;

  creatorNickname?: string;

  amountOfParticipators: number;
}
