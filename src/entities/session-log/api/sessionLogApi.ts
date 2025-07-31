import { baseApi } from "@hongpung/src/common";
import { SessionLog } from "../model/type";
import dayjs from "dayjs";

const sessionApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    loadMySessionLog: builder.fetch<
      Record<string, SessionLog[]>,
      { calendarMonth: Date }
    >({
      query: ({ calendarMonth }) => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        return {
          url: "/session-log",
          params: { year, month },
          withAuthorize: true,
        };
      },
      transformResponse: (response: SessionLog[]) => {
        const sessionLogList: Record<string, SessionLog[]> = {};

        response.forEach((sessionLog) => {
          const date = dayjs(sessionLog.date).format("YYYY-MM-DD");
          if (!sessionLogList[date]) {
            sessionLogList[date] = [];
          }
          sessionLogList[date].push(sessionLog);
        });

        // 각 날짜별로 시간순 정렬
        Object.keys(sessionLogList).forEach((date) => {
          sessionLogList[date].sort((a, b) => {
            return dayjs(a.startTime).diff(dayjs(b.startTime));
          });
        });

        return sessionLogList;
      },
      queryOptions: (params) => ({
        queryKey: ["my-session-log", params.calendarMonth],
      }),
    }),

    loadClubSessionLog: builder.fetch<
      Record<string, SessionLog[]>,
      { calendarMonth: Date }
    >({
      query: ({ calendarMonth }) => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        return {
          url: "/session-log/club",
          params: { year, month },
          withAuthorize: true,
        };
      },
      transformResponse: (response: SessionLog[]) => {
        const sessionLogList: Record<string, SessionLog[]> = {};

        response.forEach((sessionLog) => {
          const date = dayjs(sessionLog.date).format("YYYY-MM-DD");
          if (!sessionLogList[date]) {
            sessionLogList[date] = [];
          }
          sessionLogList[date].push(sessionLog);
        });

        return sessionLogList;
      },
      queryOptions: (params) => ({
        queryKey: ["club-session-log", params.calendarMonth],
      }),
    }),

    loadSessionLog: builder.fetch<SessionLog, { sessionId: number }>({
      query: ({ sessionId }) => ({
        url: `/session-log/specific/${sessionId}`,
        withAuthorize: true,
      }),
      queryOptions: (params) => ({
        queryKey: ["session-log", params.sessionId],
      }),
    }),

    loadReservationLog: builder.fetch<SessionLog, { reservationId: number }>({
      query: ({ reservationId }) => ({
        url: `/session-log/specific/reservation/${reservationId}`,
        withAuthorize: true,
      }),
      queryOptions: (params) => ({
        queryKey: ["reservation-log", params.reservationId],
      }),
    }),
  }),
});

export const {
  useLoadMySessionLogFetch,
  useLoadClubSessionLogFetch,
  useLoadSessionLogFetch,
  useLoadReservationLogFetch,
} = sessionApi;
