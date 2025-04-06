import { baseApi } from "@hongpung/src/common/api"

import { DailyReservationDto, ExistReservationDto, MonthlyReservationDto, ReservationDto } from "../api/type"
import { DailyReservation, ReservationDetail } from "../model/type"
import { mapReservationDetail } from "../lib/mapReservationDetail"
import { myTodayReservationState } from "../model/myTodayReservationState"
import { TimeFormat } from "@hongpung/src/common"
import { colorDefine } from "../lib/colorDefine"

const reservationApi = baseApi.addEndpoints({
    endpoints: (build) => ({
        loadReservationDetail: build.fetch<ReservationDetail, { reservationId: number }>({

            query: ({ reservationId }) => ({
                url: `/reservation/${reservationId}`,
                withAuthorize: true,
            }),

            transformResponse: (data: ReservationDto) => mapReservationDetail(data)

        }),

        loadOccupiedTimes: build.fetch<{ times: TimeFormat[], reservationId: number }[], { date: Date }>({
            query: ({ date }) => {

                const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000)
                const DateString = koreanTime.toISOString().split('T')[0]

                return {
                    url: `/reservation/daily/occupied`,
                    params: { date: DateString },
                    withAuthorize: true
                }
            },
            transformResponse: (data: ExistReservationDto[]) => {
                return data.map(reservation => {
                    const occupiedTimes = data.map(reservation => (reservation.startTime, reservation.endTime))
                    return { reservationId: reservation.reservationId, times: occupiedTimes };
                })

            }
        }),

        loadDailyReservations: build.fetch<DailyReservation[], { date: Date }>({
            query: ({ date }) => {

                const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000)
                const DateString = koreanTime.toISOString().split('T')[0]

                return {
                    url: `/reservation/daily`,
                    params: { date: DateString },
                    withAuthorize: true
                }

            }
        }),

        loadMonthlyReservations: build.fetch<{ [key: number]: { color: string }[] }, { calendarMonth: Date }>({
            query: ({ calendarMonth }) => {

                const koreanTime = new Date(calendarMonth.getTime() + 9 * 60 * 60 * 1000)

                return ({
                    url: `/reservation/month-calendar`,
                    params: { year: koreanTime.getUTCFullYear(), month: koreanTime.getUTCMonth() + 1 },
                    withAuthorize: true
                })

            },
            transformResponse: (data: MonthlyReservationDto[]) => {
                const reservedDates: { [key: number]: { color: string }[] } = [];

                data.map((reservation) => {
                    const reservedDate = new Date(reservation.date).getDate();
                    if (!reservedDates[reservedDate]) reservedDates[reservedDate] = [{ color: colorDefine(reservation) }];
                    else reservedDates[reservedDate] = [...reservedDates[reservedDate], { color: colorDefine(reservation) }];
                })

                return reservedDates;
            }
        }),


        loadMyTodayReservation: build.fetch<DailyReservationDto[], void>({
            recoilState: myTodayReservationState,
            query: () => ({
                url: '/reservation/today',
                withAuthorize: true
            })
        }),

        loadMySchedules: build.fetch<DailyReservationDto[], { skip?: number }>({
            query: ({ skip }) => {

                if (skip)
                    return {
                        url: '/reservation/my-schedule',
                        params: { skip },
                        withAuthorize: true
                    }

                return {
                    url: '/reservation/my-schedule',
                    withAuthorize: true
                }
            }
        })

    })
})

export const {
    useLoadDailyReservationsFetch, useLoadReservationDetailFetch, useLoadOccupiedTimesFetch, useLoadMonthlyReservationsFetch,
    useLoadMySchedulesFetch,
    useLoadMyTodayReservationFetch
} = reservationApi