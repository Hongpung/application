import { TimeArray, TimeFormat } from "@hongpung/src/common";
import { loadOccupiedTimes } from "@hongpung/src/features/reservation/api/load-occupied-times";
import { useEffect, useState } from "react";

export const useOccupiedTime = (date: Date) => {
    const [occupiedTimes, setOccupiedTimes] = useState<TimeFormat[]>([]);

    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState<{ isError: true, errorText: string } | { isError: false }>({ isError: false })

    useEffect(() => {

        async function fetchReservation() {

            setLoading(true);

            setError({ isError: false })

            try {
                const data = await loadOccupiedTimes(date);

                if (data) {
                    const occupiedTimes: TimeFormat[] = [];
                    data.map((reservation) => {
                        const { startTime, endTime } = reservation;
                        const startIdx = TimeArray.indexOf(startTime);
                        const endIdx = TimeArray.indexOf(endTime);

                        occupiedTimes.push(...TimeArray.slice(startIdx, endIdx));
                    })

                    setOccupiedTimes(occupiedTimes);
                }
            } catch (e) {

                setError({ isError: true, errorText: "예약 정보를 불러오는 데 실패했습니다." });

            } finally {
                setLoading(false);
            }
        }

        fetchReservation()

    }, [date])

    return { occupiedTimes, isLoading, isError }
}