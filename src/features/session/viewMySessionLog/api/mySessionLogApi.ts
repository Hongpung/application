import { baseApi } from "@hongpung/src/common/api";
import { SessionLog } from "@hongpung/src/entities/session-log";

const mySessionLogApi = baseApi.addEndpoints({
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
      queryOptions: ({ calendarMonth }) => ({
        queryKey: ["session-log", calendarMonth.toISOString()],
        staleTime: 0,
      }),
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
  }),
});

export const { useLoadMySessionLogFetch } = mySessionLogApi;
