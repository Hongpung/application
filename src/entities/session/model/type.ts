import { Instrument } from "@hongpung/src/entities/instrument/@x/session";
import { Member } from "@hongpung/src/entities/member/@x/reservation";

interface BaseSession {
    sessionId: number;           // 세션 ID
    sessionType: SessionType;                // 세션 유형 (공통 속성)
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
    participators?: Member[] | null;           // 참여자 목록 (optional)
    participatorIds?: Member[] | null;           // 참여자 목록 (optional)
    borrowInstruments?: Instrument[] | null; // 대여 악기 목록 (optional)
    attendanceList: { user: Member, status: '참가' | '출석' | '결석' | '지각' }[]
}

export type Session = RealtimeSession | ReservationSession;

export interface RealtimeSession extends BaseSession {
    sessionType: 'REALTIME';         // 세션 유형
    participators?: null;           // 실시간 생성 세션은 참여자, 대여 악기가 없읍
    participatorIds?: Member[] | null;           // 참여자 목록 (optional)
    borrowInstruments?: null;
    attendanceList: { user: Member, status: '참가' }[]
}

export interface ReservationSession extends BaseSession {
    reservationId: number;            // 예약 ID
    sessionType: 'RESERVED';              // 세션 유형 (예약으로 고정)
    reservationType: ReservationType         // 예약 유형 (정기연습, 특별행사 등)
    participationAvailable: boolean;  // 참여 가능 여부
    participators: Member[]
    borrowInstruments: Instrument[]
    attendanceList: { user: Member, status: '출석' | '결석' | '지각' }[]
}


export type SessionLog = RealtimeSession & {
    isForcedEnd: boolean;
    returnImageUrl: string[];
} | ReservationSession & {
    isForcedEnd: boolean;
    returnImageUrl: string[];
}

export type EmptyCard = {
    type: 'empty';
    nextReservationTime: string;
};

export type SessionCard = {
    type: 'session';
    session: Session;
}

export type ScheduleCard = EmptyCard | SessionCard