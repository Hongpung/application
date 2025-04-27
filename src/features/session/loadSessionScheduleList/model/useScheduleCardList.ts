import { isOpen } from "@hongpung/src/entities/session/lib/isRoomOpen";
import { timeToDate } from "@hongpung/src/entities/session/lib/timeToDate";
import { ScheduleCard, Session } from "@hongpung/src/entities/session/model/type";
import { useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";

const useScheduleCardList = (sessionList: Session[] | null) => {

    const [isOnAir, setOnAir] = useState<'PREPARING' | 'ON_AIR' | 'CLOSED' | 'AVAILABLE'>('AVAILABLE');
    const [isParticipatible, setParticipatible] = useState(false);
    const [scheduleCardList, setScheduleCardList] = useState<ScheduleCard[]>([])
    const [slideToIndex, setSlideToIndex] = useState<number | null>(null)

    const cardViewRef = useRef<FlatList>(null)

    useEffect(() => {
        
        if (!sessionList) return;

        const utcTime = new Date();
        const koreaTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);
        const slideTo: { index: number | null } = { index: null }
        const fetchReservationCards: ScheduleCard[] = []

        const sortedSessionList = sessionList.sort((a, b) => (a.startTime.localeCompare(b.startTime)));
        
        setOnAir('AVAILABLE') // onAir 상태 초기화

        sortedSessionList.forEach((session, index) => {
            if (session.sessionType === 'RESERVED') {
                handleReservedSession(session, index, sortedSessionList, fetchReservationCards, slideTo, koreaTime);
            } else if (session.sessionType === 'REALTIME') {
                handleRealtimeSession(session, index, sortedSessionList, fetchReservationCards, slideTo, koreaTime);
            }
        });
        if (!isOpen) {
            setOnAir('CLOSED');
        }
        // 슬라이드 인덱스 설정
        if (!slideTo.index && fetchReservationCards.length > 1) {
            slideTo.index = fetchReservationCards.length - 1;
        }
        setScheduleCardList(fetchReservationCards);
        setSlideToIndex(slideTo.index ?? 0);

    }, [sessionList]);

    useEffect(() => {
        if (slideToIndex !== null && slideToIndex < scheduleCardList.length) {
            cardViewRef.current?.scrollToIndex({ index: slideToIndex, animated: true });
        }
    }, [slideToIndex]);

    return { isOnAir, isParticipatible, scheduleCardList, cardViewRef };

    // 예약 세션 처리 함수
    function handleReservedSession(
        session: Session,
        index: number,
        sessionList: Session[],
        fetchReservationCards: ScheduleCard[],
        slideTo: { index: number | null },
        koreaTime: Date
    ) {
        if (session.status === 'AFTER' || session.status === 'DISCARDED') {
            fetchReservationCards.push({ type: 'session', session });
            if (!sessionList[index + 1] && isOpen) {
                slideTo.index = index + 1;
                fetchReservationCards.push({ type: 'empty', nextReservationTime: '없음' });
            }
        } else if (session.status === 'ONAIR') {
            slideTo.index = index;
            setOnAir('ON_AIR');
            setParticipatible(session.participationAvailable);
            fetchReservationCards.push({ type: 'session', session });
        } else if (session.status === 'BEFORE') {
            if (slideTo.index === null) {
                slideTo.index = index;
                if (isSessionStartInTime(session, koreaTime) && isOpen) {
                    fetchReservationCards.push({ type: 'empty', nextReservationTime: session.startTime });
                } else if (isOpen) {
                    setOnAir('PREPARING');
                }
            }
            fetchReservationCards.push({ type: 'session', session });
        }
    }

    // 실시간 세션 처리 함수
    function handleRealtimeSession(
        session: Session,
        index: number,
        sessionList: Session[],
        fetchReservationCards: ScheduleCard[],
        slideTo: { index: number | null },
        koreaTime: Date
    ) {
        fetchReservationCards.push({ type: 'session', session });
        if (session.status === 'ONAIR') {
            setOnAir('ON_AIR');
            setParticipatible(session.participationAvailable);
        } else if (!sessionList[index + 1] && isOpen && koreaTime <= timeToDate('22:00:00')) {
            slideTo.index = index + 1;
            fetchReservationCards.push({ type: 'empty', nextReservationTime: '없음' });
        }
    }

    // 예약 세션 시작 시간이 현재 시간보다 40분 이상 남았는지 확인
    function isSessionStartInTime(session: Session, koreaTime: Date): boolean {
        const date = koreaTime.toISOString().split('T')[0];
        const sessionStartTime = new Date(`${date}T${session.startTime}Z`);
        const timeGap = sessionStartTime.getTime() - koreaTime.getTime();
        return timeGap > 40 * 60 * 1000;
    }
}

export { useScheduleCardList }