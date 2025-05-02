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
import { myTodayReservationState } from "../model/myTodayReservationState";
import { TimeArray, TimeFormat } from "@hongpung/src/common";
import { colorDefine } from "../lib/colorDefine";
import type { Member } from "@hongpung/src/entities/member/@x/reservation";
import { Instrument } from "../../instrument/@x/reservation";

const reservationApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    loadReservationDetail: builder.fetch<
      ReservationDetail,
      { reservationId: number }
    >({
      query: ({ reservationId }) => ({
        url: `/reservation/${reservationId}`,
        withAuthorize: true,
      }),

      transformResponse: (data: ReservationDto) => mapReservationDetail(data),
    }),

    loadOccupiedTimes: builder.fetch<
      { times: TimeFormat[]; reservationId: number }[],
      { date: Date }
    >({
      query: ({ date }) => {
        const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
        const DateString = koreanTime.toISOString().split("T")[0];

        return {
          url: `/reservation/daily/occupied`,
          params: { date: DateString },
          withAuthorize: true,
        };
      },
      transformResponse: (data: ExistReservationDto[]) => {
        return data.map((reservation) => {
          const occupiedTimes = data.map((reservation) => {
            const firstTimeIndex = TimeArray.indexOf(
              reservation.startTime
            );
            const lastTimeIndex = TimeArray.indexOf(
              reservation.endTime
            );
            return TimeArray.slice(firstTimeIndex, lastTimeIndex)
          }).flat();
          return {
            reservationId: reservation.reservationId,
            times: occupiedTimes,
          };
        });
      },
    }),

    loadDailyReservations: builder.fetch<DailyReservation[], { date: Date }>({
      query: ({ date }) => {
        const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
        const DateString = koreanTime.toISOString().split("T")[0];

        return {
          url: `/reservation/daily`,
          params: { date: DateString },
          withAuthorize: true,
        };
      },
    }),

    loadMonthlyReservations: builder.fetch<
      { [key: number]: { color: string }[] },
      { calendarMonth: Date }
    >({
      query: ({ calendarMonth }) => {
        const koreanTime = new Date(
          calendarMonth.getTime() + 9 * 60 * 60 * 1000
        );
        return {
          url: `/reservation/month-calendar`,
          params: {
            year: koreanTime.getUTCFullYear(),
            month: koreanTime.getUTCMonth() + 1,
          },
          withAuthorize: true,
        };
      },
      transformResponse: (data: MonthlyReservationDto[]) => {
        const reservedDates: { [key: number]: { color: string }[] } = [];

        data.map((reservation) => {
          const reservedDate = new Date(reservation.date).getDate();
          if (!reservedDates[reservedDate])
            reservedDates[reservedDate] = [{ color: colorDefine(reservation) }];
          else
            reservedDates[reservedDate] = [
              ...reservedDates[reservedDate],
              { color: colorDefine(reservation) },
            ];
        });

        return reservedDates;
      },
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
    }),

    borrowPossibleInstruments: builder.fetch<Instrument[], void>({
      query: () => ({
        url: `/instrument/borrow-list`,
        withAuthorize: true,
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
    }),

    deleteReservation: builder.request<void, { reservationId: number }>({
      query: ({ reservationId }) => {
        return {
          url: `/reservation/${reservationId}`,
          withAuthorize: true,
          method: "DELETE",
        };
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
    }),

    loadMyTodayReservation: builder.fetch<DailyReservationDto[], void>({
      recoilState: myTodayReservationState,
      query: () => ({
        url: "/reservation/today",
        withAuthorize: true,
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
    }),
    loadMyUpcommingSchedule: builder.fetch<Reservation[], { skip: number }>({
      query: ({ skip }) => ({
        url: `/reservation/my-schedule?skip=${skip}`,
        method: "GET",
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
