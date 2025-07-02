import { baseApi } from "@hongpung/src/common";

// 필요한 타입들 import 추가
import {
  SessionState,
  CheckInAttendStatus,
  CheckInStartStatus,
} from "../model/type";

import { CheckOutBody } from "./type";
import { SessionLog } from "@hongpung/src/entities/session-log/@x/session";

const sessionApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    userUseRoom: builder.fetch<boolean, void>({
      query: () => ({
        url: "/session/is-checkin",
        method: "GET",
        withAuthorize: true,
      }),
      transformResponse: (response: { isCheckin: boolean }) => {
        console.log("response", response);
        return response.isCheckin;
      },
      queryOptions: () => ({
        queryKey: ["user-use-room"],
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
      }),
    }),

    extendSession: builder.request<{ message: string }, void>({
      query: () => ({
        url: `/session/extend`,
        method: "POST",
        withAuthorize: true,
      }),
      queryOptions: {
        mutationKey: ["session", "extend"],
      },
    }),

    // CheckIn 관련 API 엔드포인트들 추가
    checkInPossibility: builder.fetch<SessionState, void>({
      query: () => ({
        url: `/check-in/check-possible`,
        withAuthorize: true,
      }),
      queryOptions: () => ({
        queryKey: ["check-in-possibility"],
      }),
    }),

    startSession: builder.request<
      { status: CheckInStartStatus },
      { participationAvailable?: boolean }
    >({
      query: (body) => ({
        url: `/check-in/start`,
        withAuthorize: true,
        method: "POST",
        options: { headers: { "Content-Type": "application/json" } },
        body,
      }),
      queryOptions: {
        mutationKey: ["user-use-room"],
      },
    }),

    attendSession: builder.request<{ status: CheckInAttendStatus }, void>({
      query: () => ({
        url: `/check-in/attend`,
        withAuthorize: true,
        method: "POST",
      }),
      queryOptions: {
        mutationKey: ["user-use-room"],
      },
    }),

    endSession: builder.request<
      { message: string; endSessionData: SessionLog },
      CheckOutBody
    >({
      query: (body) => ({
        url: `/session/end`,
        withAuthorize: true,
        method: "POST",
        body,
        options: { headers: { "Content-Type": "application/json" } },
      }),
      queryOptions: {
        mutationKey: ["user-use-room"],
      },
    }),
  }),
});

export const {
  useExtendSessionRequest,
  useUserUseRoomFetch,
  // CheckIn 관련 훅들 export 추가
  useCheckInPossibilityFetch,
  useStartSessionRequest,
  useAttendSessionRequest,
  useEndSessionRequest,
} = sessionApi;
