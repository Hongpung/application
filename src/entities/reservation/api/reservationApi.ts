import { baseApi } from "@hongpung/src/common/api";

import {
  DailyReservationDto,
  ExistReservationDto,
  MonthlyReservationDto,
  ReservationCreateRequestBody,
  ReservationDto,
  ReservationEditRequestBody,
} from "./type";

import {
  DailyReservation,
  Reservation,
  ReservationDetail,
} from "../model/type";
import { mapReservationDetail } from "../lib/mapReservationDetail";
import { TimeArray, TimeFormat } from "@hongpung/src/common";
import { getReservationColor } from "../lib/getReservationColor";
import type { Member } from "@hongpung/src/entities/member/@x/reservation";
import { Instrument } from "../../instrument/@x/reservation";
import dayjs from "dayjs";

const reservationApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    loadReservationDetail: builder.fetch<
      ReservationDetail,
      { reservationId: number }
    >({
      query: ({ reservationId }) => ({
        url: `/reservation/${reservationId}`,
        withAuthorize: true,
        refetchOnFocus: true,
      }),

      transformResponse: (data: ReservationDto) => mapReservationDetail(data),
      queryOptions: (params) => ({
        queryKey: ["reservation-detail", params.reservationId],
      }),
    }),

    loadOccupiedTimes: builder.fetch<
      { reservationId: number; times: TimeFormat[] }[],
      { date: Date }
    >({
      query: ({ date }) => {
        const koreanTime = dayjs(date);
        const DateString = koreanTime.format("YYYY-MM-DD");

        return {
          url: `/reservation/daily/occupied`,
          params: { date: DateString },
          withAuthorize: true,
        };
      },
      transformResponse: (data: ExistReservationDto[]) => {
        return data.map((reservation) => {
          const occupiedTimes = data
            .map((reservation) => {
              const firstTimeIndex = TimeArray.indexOf(reservation.startTime);
              const lastTimeIndex = TimeArray.indexOf(reservation.endTime);
              return TimeArray.slice(firstTimeIndex, lastTimeIndex);
            })
            .flat();
          return {
            reservationId: reservation.reservationId,
            times: occupiedTimes,
          };
        });
      },
      queryOptions: (params) => ({
        queryKey: ["daily-reservations", params.date],
      }),
    }),

    loadDailyReservations: builder.fetch<DailyReservation[], { date: Date }>({
      query: ({ date }) => {
        const koreanTime = dayjs(date);
        const DateString = koreanTime.format("YYYY-MM-DD");

        return {
          url: `/reservation/daily`,
          params: { date: DateString },
          withAuthorize: true,
          refetchOnFocus: true,
        };
      },
      queryOptions: (params) => ({
        queryKey: ["daily-reservations", params.date],
      }),
    }),

    loadMonthlyReservations: builder.fetch<
      { [key: number]: { color: string }[] },
      { calendarMonth: Date }
    >({
      query: ({ calendarMonth }) => {
        const koreanTime = dayjs(calendarMonth);
        return {
          url: `/reservation/month-calendar`,
          params: {
            year: koreanTime.year(),
            month: koreanTime.month() + 1,
          },
          withAuthorize: true,
          refetchOnFocus: true,
        };
      },
      transformResponse: (data: MonthlyReservationDto[]) => {
        const reservedDates: { [key: number]: { color: string }[] } = [];

        data.map((reservation) => {
          const reservedDate = dayjs(reservation.date).date();
          if (!reservedDates[reservedDate])
            reservedDates[reservedDate] = [
              { color: getReservationColor(reservation) },
            ];
          else
            reservedDates[reservedDate] = [
              ...reservedDates[reservedDate],
              { color: getReservationColor(reservation) },
            ];
        });

        return reservedDates;
      },
      queryOptions: (params) => ({
        queryKey: ["monthly-reservations", params.calendarMonth],
      }),
    }),

    searchInvitePossibleMembers: builder.fetch<
      Member[],
      { keyword?: string; clubId?: number[]; page?: number }
    >({
      query: ({ page = 0, ...params }) => {
        return {
          url: `/member/invite-possible`,
          withAuthorize: true,
          params: { page, ...params },
        };
      },
      queryOptions: (params) => ({
        queryKey: [
          "search-invite-possible-members",
          params.keyword,
          params.clubId,
          params.page,
        ],
      }),
    }),

    borrowPossibleInstruments: builder.fetch<Instrument[], void>({
      query: () => ({
        url: `/instrument/borrow-list`,
        withAuthorize: true,
      }),
      queryOptions: (params) => ({
        queryKey: ["borrow-possible-instruments"],
      }),
    }),

    createReservation: builder.request<
      { reservationId: number },
      ReservationCreateRequestBody
    >({
      query: ({ ...body }) => {
        return {
          url: `/reservation`,
          withAuthorize: true,
          method: "POST",
          body: body,
          options: {
            headers: {
              "Content-Type": "application/json",
            },
          },
        };
      },
      queryOptions: {
        mutationKey: ["reservation"],
      },
    }),

    editReservation: builder.request<void, ReservationEditRequestBody>({
      query: ({ reservationId, ...body }) => {
        return {
          url: `/reservation/${reservationId}`,
          withAuthorize: true,
          method: "PATCH",
          body: body,
          options: {
            headers: {
              "Content-Type": "application/json",
            },
          },
        };
      },
      queryOptions: {
        mutationKey: ["reservation"],
      },
    }),

    deleteReservation: builder.request<void, { reservationId: number }>({
      query: ({ reservationId }) => {
        return {
          url: `/reservation/${reservationId}`,
          withAuthorize: true,
          method: "DELETE",
        };
      },
      queryOptions: {
        mutationKey: ["reservation"],
      },
    }),

    leaveReservation: builder.request<void, { reservationId: number }>({
      query: ({ reservationId }) => {
        return {
          url: `/reservation/${reservationId}/leave`,
          withAuthorize: true,
          method: "POST",
        };
      },
      queryOptions: {
        mutationKey: ["reservation"],
      },
    }),

    loadMyTodayReservation: builder.fetch<DailyReservationDto[], void>({
      query: () => ({
        url: "/reservation/today",
        withAuthorize: true,
      }),
      queryOptions: (params) => ({
        queryKey: ["my-today-reservation"],
        staleTime: 60 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
      }),
    }),

    loadMySchedules: builder.fetch<DailyReservationDto[], { skip?: number }>({
      query: ({ skip }) => {
        if (skip)
          return {
            url: "/reservation/my-schedule",
            params: { skip },
            withAuthorize: true,
          };

        return {
          url: "/reservation/my-schedule",
          withAuthorize: true,
        };
      },
      queryOptions: (params) => ({
        queryKey: ["my-schedules", params.skip],
      }),
    }),
    loadMyUpcommingSchedule: builder.fetch<Reservation[], { skip: number }>({
      query: ({ skip }) => ({
        url: `/reservation/my-schedule?skip=${skip}`,
        method: "GET",
      }),
      queryOptions: (params) => ({
        queryKey: ["my-upcomming-schedule", params.skip],
      }),
    }),
  }),
});

export const {
  useLoadDailyReservationsFetch,
  useLoadReservationDetailFetch,
  useLoadOccupiedTimesFetch,
  useLoadMonthlyReservationsFetch,
  useLoadMySchedulesFetch,
  useLoadMyTodayReservationFetch,
  useLoadMyUpcommingScheduleFetch,
  useCreateReservationRequest,
  useEditReservationRequest,
  useDeleteReservationRequest,
  useLeaveReservationRequest,
  useSearchInvitePossibleMembersFetch,
  useBorrowPossibleInstrumentsFetch,
} = reservationApi;
