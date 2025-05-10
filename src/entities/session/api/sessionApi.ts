import { baseApi } from "@hongpung/src/common";
import { SessionLog } from "../model/type";
import { UseRoomState } from "../model/UseRoomState";

const sessionApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    userUseRoom: builder.fetch<boolean, void>({
      stateKey: UseRoomState,
      query: () => ({
        url: "/session/is-checkin",
        method: "GET",
        withAuthorize: true,
      }),
      transformResponse: (response: { isCheckin: boolean }) => {
        console.log("response", response);
        return response.isCheckin;
      },
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
          const date = new Date(sessionLog.date).toISOString().split("T")[0];
          if (!sessionLogList[date]) {
            sessionLogList[date] = [];
          }
          sessionLogList[date].push(sessionLog);
        });

        return sessionLogList;
      },
    }),
    extendSession: builder.request<{ message: string }, void>({
      query: () => ({
        url: `/session/extend`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoadClubSessionLogFetch,
  useExtendSessionRequest,
  useUserUseRoomFetch,
} = sessionApi;
