import { EntitiesApiType } from "@hongpung/src/common"

export const reservationApi = {

    loadReservationDetail: (reservationId: number) => ({
        input: `${process.env.EXPO_PUBLIC_BASE_URL}/reservation/${reservationId}`,
        init: {
            method: 'GET',
        }
    }),

    loadDailyReservations: (date: Date) => {
        const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000)
        const DateString = koreanTime.toISOString().split('T')[0]

        return ({
            method: 'GET',
            url: `${process.env.EXPO_PUBLIC_BASE_URL}/reservation/${DateString}`
        })
    },

    loadMonthlyReservations: (calendarMonth: Date) => {
        const koreanTime = new Date(calendarMonth.getTime() + 9 * 60 * 60 * 1000)

        return ({
            method: 'GET',
            url: `${process.env.EXPO_PUBLIC_BASE_URL}/reservation/month-calendar?year=${koreanTime.getUTCFullYear()}&month=${koreanTime.getUTCMonth() + 1}`
        })
    },

    loadOccupiedTimes: (date: Date) => {
        const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000)
        const DateString = koreanTime.toISOString().split('T')[0]

        return ({
            method: 'GET',
            url: `${process.env.EXPO_PUBLIC_BASE_URL}/reservation/daily/occupied?date=${DateString}`
        })
    }

}