import { addTokenToHeader, getToken } from "@hongpung/src/common/lib/TokenHandler";
import { MonthlyReservationDTO } from "@hongpung/src/entities/reservation";
import { reservationApi } from "@hongpung/src/entities/reservation/api/reservation-api";

export async function loadMonthlyReservations(calendarMonth: Date): Promise<MonthlyReservationDTO[]> {

    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const { url, method } = reservationApi.loadMonthlyReservations(calendarMonth);

    try {
        const token = await getToken('token');

        if (!token) throw Error('token is not valid')

        const response = await fetch(url,
            {
                method,
                headers: addTokenToHeader(token),
                signal
            }
        )

        if (!response.ok) throw Error('Load reservations is failed')

        const loadedReservation = await response.json() as MonthlyReservationDTO[];

        return loadedReservation;

    } catch (e) {

        throw Error('Load reservations is failed')

    } finally {
        clearTimeout(timeoutId);
    }
}