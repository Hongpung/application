import { baseApi } from "@hongpung/src/common/api/baseApi";
import { Instrument } from "@hongpung/src/entities/instrument/@x/reservation";

export const loadClubApi = baseApi.addEndpoints({
  endpoints: (build) => ({
    loadClubInstruments: build.fetch<Instrument[], void>({
      query: () => ({
        url: "/club/my-club/instruments",
        withAuthorize: true,
      }),
      queryOptions: () => ({
        queryKey: ["club-instruments"],
        staleTime: 0,
      }),
    }),
  }),
});

export const { useLoadClubInstrumentsFetch } = loadClubApi;
