import { baseApi } from "@hongpung/src/common/api/baseApi";
import { Reservation } from "@hongpung/src/entities/reservation";

export const upcommingScheduleApi = baseApi.addEndpoints({
  endpoints: (build) => ({
    loadMyUpcommingSchedule: build.fetch<Reservation[], { skip: number }>({
      query: ({ skip }) => ({
        url: `/reservation/my-schedule?skip=${skip}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useLoadMyUpcommingScheduleFetch } = upcommingScheduleApi; 