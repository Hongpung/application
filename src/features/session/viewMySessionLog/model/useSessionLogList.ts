import { SessionLog } from "@hongpung/src/entities/session";
import { useCallback, useMemo } from "react";

export const useSessionLogList = (sessionList?: Record<string, SessionLog[]> | null, selectedDate?: Date | null) => {

    if (!sessionList || !selectedDate) {
        return { matchedSessionList: {} as [string, SessionLog[]][] };
    }

    const matchSessionListToDate = useCallback((sessionList: Record<string, SessionLog[]>, selectedDate: Date | null) => {

        if (!!selectedDate) {

            const dateString = new Date(selectedDate.getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
            const matchedSessionListBucket: Record<string, SessionLog[]> = {};

            matchedSessionListBucket[dateString] = sessionList[dateString]

            return matchedSessionListBucket;
        }

        return sessionList;

    }, [])

    const matchedSessionList = useMemo(() => {
        if (!!sessionList) {
            return matchSessionListToDate(sessionList, selectedDate);
        }
        return {};
    }, [sessionList, selectedDate])

    return { matchedSessionList: Object.entries(matchedSessionList) }
}