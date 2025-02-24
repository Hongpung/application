import { useEffect, useState } from "react";
import { loadMonthlyReservations } from "@hongpung/src/features/reservation";
import { colorDefine } from "./color-define";

export function useMonthlyReservations(calendarMonth: Date) {

    const [reservationsData, setReservedDates] = useState<{ [key: number]: { color: string }[] }>([]);

    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState<{ isError: true, errorText: string } | { isError: false }>({ isError: false })

    useEffect(() => {

        async function fetchReservation() {

            setLoading(true);

            setError({ isError: false })

            try {
                const data = await loadMonthlyReservations(calendarMonth);
                
                if (data) {
                    const reservedDates: { [key: number]: { color: string }[] } = [];
                    data.map((reservation) => {
                        const reservedDate = new Date(reservation.date).getDate();
                        if (!reservedDates[reservedDate]) reservedDates[reservedDate] = [{ color: colorDefine(reservation) }];
                        else reservedDates[reservedDate] = [...reservedDates[reservedDate], { color: colorDefine(reservation) }];
                    })

                    setReservedDates(reservedDates);
                }
            } catch (e) {

                setError({ isError: true, errorText: "예약 정보를 불러오는 데 실패했습니다." });

            } finally {
                setLoading(false);
            }
        }

        fetchReservation()

    }, [calendarMonth])

    return { reservationsData, isLoading, isError }
}