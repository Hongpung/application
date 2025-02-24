import { useEffect, useState } from "react";

import { DailyReservationDTO } from "@hongpung/src/entities/reservation";
import { loadDailyReservations } from "@hongpung/src/features/reservation";

export function useDailyReservations(date: Date) {

    const [reservations, setReservations] = useState<DailyReservationDTO[] >([])

    const [isLoading, setLoading] = useState(false);
    
    const [isError, setError] = useState<{ isError: true, errorText: string } | { isError: false }>({ isError: false })

    useEffect(() => {

        async function fetchDailyReservations() {
            setReservations([])
            setLoading(true);
            setError({ isError: false })

            try {
                const data = await loadDailyReservations(date);
                setReservations(data);

            } catch (e) {
                setError({ isError: true, errorText: "예약 정보를 불러오는 데 실패했습니다." });
            } finally {
                setLoading(false);
            }
        }

        fetchDailyReservations()
        
    }, [date])

    return { reservations, isLoading, isError }
}