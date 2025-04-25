import { useCallback, useEffect, useState } from "react";
import { Reservation } from "@hongpung/src/entities/reservation";
import { useLoadMyUpcommingScheduleFetch } from "../api/upcommingScheduleApi";

export const useLoadMyUpcommingSchedule = () => {

    const [skip, setSkip] = useState(0);
    const [reservationList, setReservationList] = useState<Reservation[]>([]);
    const { data: loadReservations, isLoading } = useLoadMyUpcommingScheduleFetch(
        { skip }
    );

    useEffect(() => {
        if (loadReservations && loadReservations.length > 0) {
            setReservationList((prev) => [...prev, ...loadReservations]);
        }
    }, [loadReservations]);

    const loadMore = useCallback(() => {
        if (loadReservations && loadReservations.length > 0) {
            setSkip((prev) => prev + 1);
        }
    }, [loadReservations]);
    
    const groupReservationsByDate = (reservations: Reservation[]): [string, Reservation[]][] => {
        const grouped: { [key: string]: Reservation[] } = {};
        reservations.forEach(reservation => {
            if (!grouped[reservation.date]) {
                grouped[reservation.date] = [];
            }
            grouped[reservation.date].push(reservation);
        });

        return Object.entries(grouped);
    };

    

    return {
        reservationList: groupReservationsByDate(reservationList),
        isLoading,
        loadMore,
    };
}; 