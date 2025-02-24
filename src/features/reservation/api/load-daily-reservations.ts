import { addTokenToHeader, getToken } from "@hongpung/src/common/lib/TokenHandler";
import { DailyReservationDTO } from "@hongpung/src/entities/reservation";
import { reservationApi } from "@hongpung/src/entities/reservation/api/reservation-api";

export async function loadDailyReservations(date: Date): Promise<DailyReservationDTO[]> {

    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const { url, method } = reservationApi.loadDailyReservations(date);

    try {
        const token = await getToken('token');

        if (!token) throw Error('token is not valid')

        const response = await fetch(url,
            {
                method,
                headers: { ...addTokenToHeader(token) },
                signal
            }
        )

        if (!response.ok) throw Error('Load reservations is failed')

        const loadedReservation = await response.json() as DailyReservationDTO[];

        return loadedReservation;

    } catch (e) {

        throw Error('Load reservations is failed')

    } finally {
        clearTimeout(timeoutId);
    }
}