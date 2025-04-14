import { baseApi } from "@hongpung/src/common/api/baseApi";
import { CheckInStartStatus, CheckInAttendStatus, SessionState } from "./type";


const checkInApi = baseApi.addEndpoints({
    endpoints: (builder) => ({
        checkInPossibility: builder.fetch<SessionState, void>({
            query: () => ({
                url: `/check-in/check-possible`,
                withAuthorize: true
            }),
        }),
        startSession: builder.request<CheckInStartStatus, { participationAvailable?: boolean }>({
            query: () => ({
                url: `/check-in/start`,
                withAuthorize: true,
                method: 'POST',
                options: { headers: { 'Content-Type': 'application/json' } }
            }),
        }),
        attendSession: builder.request<CheckInAttendStatus, void>({
            query: () => ({
                url: `/check-in/attend`,
                withAuthorize: true,
                method: 'POST',
                options: { headers: { 'Content-Type': 'application/json' } }
            }),
        }),
    }),
})

export const { useCheckInPossibilityFetch, useStartSessionRequest, useAttendSessionRequest } = checkInApi;
