import { ReservationDTO } from "@hongpung/src/entities/reservation";
import { useEffect, useState } from "react";
import { loadReservationDetail } from "@hongpung/src/features/reservation";

export function useReservationDetail(reservationId: number) {
    const [reservation, setReservation] = useState<ReservationDTO | null>(null)
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState<{ isError: true, errorText: string } | { isError: false }>({ isError: false })

    useEffect(() => {

        async function fetchReservation() {
            setLoading(true);
            setError({ isError: false })

            try {
                const data = await loadReservationDetail(reservationId);
                setReservation(data);
            } catch (e) {
                setError({ isError: true, errorText: "예약 정보를 불러오는 데 실패했습니다." });
            } finally {
                setLoading(false);
            }
        }

        fetchReservation()
        
    }, [reservationId])

    return { reservation, isLoading, isError }
}