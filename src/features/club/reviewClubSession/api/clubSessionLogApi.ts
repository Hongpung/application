import { baseApi } from "@hongpung/src/common/api";
import { SessionLog } from "@hongpung/src/entities/session";

const clubSessionLogApi = baseApi.addEndpoints({
    endpoints: (builder) => ({
        loadClubSessionLog: builder.fetch<Record<string, SessionLog[]>, { calendarMonth: Date }>({
            query: ({ calendarMonth }) => {
                const year = calendarMonth.getFullYear()
                const month = calendarMonth.getMonth();
                return ({
                    url: '/session-log/club',
                    params: { year, month }
                })
            },
            transformResponse: (response: SessionLog[]) => {

                const sessionLogList: Record<string, SessionLog[]> = {};

                response.forEach((sessionLog) => {
                    const date = new Date(sessionLog.date).toISOString().split('T')[0];
                    if (!sessionLogList[date]) {
                        sessionLogList[date] = [];
                    }
                    sessionLogList[date].push(sessionLog);
                });

                return sessionLogList;
            }
        }),
    }),
});

export const { useLoadClubSessionLogFetch } = clubSessionLogApi;