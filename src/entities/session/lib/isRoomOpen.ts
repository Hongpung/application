import { timeToDate } from "./timeToDate";

export const isOpen = ((): boolean => {
    const utcTime = new Date();
    const koreaTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);
    return timeToDate('08:00:00') <= koreaTime && timeToDate('22:30:00') >= koreaTime
})()
