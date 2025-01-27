import useFetchUsingToken from "@hongpung/hoc/useFetchUsingToken";

import { createContext, useContext, useEffect, useState } from "react";
import { BreifSession } from "@hongpung/pages/MyPage/MyPractices/MyPracticesScreen";


interface CalendarViewContextProps {
    selectedDate: Date | null;
    setDate: (date: Date | null) => void;

    calendarMonth: Date;
    setMonth: (date: Date) => void;

    sessionList: Record<string, BreifSession[]>;
    loading: boolean;
    error: any;

    dailyReservations: Record<number, { color: string }[]>;
}

const CalendarViewContext = createContext<CalendarViewContextProps | undefined>(undefined);

export const CalendarProvider: React.FC<{ fetchUrl: string, children: React.ReactNode }> = ({ fetchUrl, children }) => {

    const [selectedDate, setDate] = useState<Date | null>(null);
    const [calendarMonth, setMonth] = useState<Date>(new Date(new Date().setDate(1)));

    const [sessionList, setSessionList] = useState<Record<string, BreifSession[]>>({});
    const [dailyReservations, setDailyReservations] = useState<Record<number, { color: string }[]>>({});

    const { data: sessionDatas, loading, error } = useFetchUsingToken<BreifSession[]>(
        `${fetchUrl}?year=${calendarMonth.getFullYear()}&month=${calendarMonth.getMonth()}`,
        {},
        5000,
        [calendarMonth]
    );

    const colorDefine = ({ reservationType, participationAvailable }: { reservationType?: string, participationAvailable: boolean }) => {
        if (reservationType === 'REGULAR') return 'blue';
        if (participationAvailable) return 'green';//
        return 'red';
    };
    console.log(sessionDatas)

    useEffect(() => {

        if (!!sessionDatas) {
            console.log('changed:' + JSON.stringify(sessionDatas))

            const dailyReservationBucket: { [key: number]: { color: string }[] } = {};
            const sessionListBucket: { [key: string]: (BreifSession & { color: string })[] } = {};

            sessionDatas?.forEach((session) => {

                const { date: sessionDateString } = session;

                const sessionDate = new Date(sessionDateString).getDate();

                if (!dailyReservationBucket[sessionDate]) {

                    dailyReservationBucket[sessionDate] = [{ color: colorDefine(session) }];

                } else {

                    dailyReservationBucket[sessionDate] = [...dailyReservationBucket[sessionDate], { ...session, color: colorDefine(session) }];

                }

                if (!sessionListBucket[sessionDateString]) {

                    sessionListBucket[sessionDateString] = [{ ...session, color: colorDefine(session) }];

                } else {

                    sessionListBucket[sessionDateString] = [...sessionListBucket[sessionDateString], { ...session, color: colorDefine(session) }];

                }

            });

            setDailyReservations(dailyReservationBucket);
            setSessionList(sessionListBucket);

        }

    }, [sessionDatas]);

    return (
        <CalendarViewContext.Provider value={{ selectedDate, setDate, calendarMonth, setMonth, sessionList, dailyReservations, loading, error }}>

            {children}

        </CalendarViewContext.Provider>
    );
};

export const useCalendar = () => {

    const context = useContext(CalendarViewContext);

    if (!context) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }

    return context;
};