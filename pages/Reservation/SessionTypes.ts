import { InstrumentWithOutBorrowHistory, User } from "@hongpung/UserType";
import { reservationType } from "./ReservationInterface";

export type sessionType = 'REALTIME' | 'RESERVED';

export interface BaseSession {
    sessionId: number;           // 세션 ID
    sessionType: sessionType;                // 세션 유형 (공통 속성)
    title: string;                  // 예약 메시지 또는 설명
    date: string;
    startTime: string;                // 시작 시간 (HH:MM:SS 형식)
    endTime: string;                  // 종료 시간 (HH:MM:SS 형식)
    extendCount: number;              // 연장 횟수
    creatorId: number;
    creatorName: string;              // 생성자 이름
    creatorNickname: string           //생성자 닉네임
    participationAvailable: boolean;  // 참여 가능 여부
    status: 'BEFORE' | 'ONAIR' | 'AFTER' | 'DISCARDED';
    participators?: User[] | null;           // 참여자 목록 (optional)
    participatorIds?: User[] | null;           // 참여자 목록 (optional)
    borrowInstruments?: InstrumentWithOutBorrowHistory[] | null; // 대여 악기 목록 (optional)
    attendanceList: { user: User, status: '참가' | '출석' | '결석' | '지각' }[]
}

export interface RealtimeSession extends BaseSession {
    sessionType: 'REALTIME';         // 세션 유형
    participators?: null;           // 실시간 생성 세션은 참여자, 대여 악기가 없읍
    participatorIds?: User[] | null;           // 참여자 목록 (optional)
    borrowInstruments?: null;
    attendanceList: { user: User, status: '참가' }[]
}

export interface ReservationSession extends BaseSession {
    reservationId: number;            // 예약 ID
    sessionType: 'RESERVED';              // 세션 유형 (예약으로 고정)
    reservationType: reservationType         // 예약 유형 (정기연습, 특별행사 등)
    participationAvailable: boolean;  // 참여 가능 여부
    participators: User[]
    borrowInstruments: InstrumentWithOutBorrowHistory[]
    attendanceList: { user: User, status: '출석' | '결석' | '지각' }[]
}

export interface SessionLog extends BaseSession {
    returnImageUrl: string[]
}