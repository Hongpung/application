import { baseApi } from "@hongpung/src/common/api";
import type { ClubInfo } from "../model/type";
import type { Member } from "@hongpung/src/entities/member/@x/club";
import type { Instrument } from "@hongpung/src/entities/instrument/@x/club";

const clubApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    loadClubInfo: builder.suspenseFetch<ClubInfo, void>({
      query: () => ({
        url: "/club/my-club",
        withAuthorize: true,
      }),
      queryOptions: () => ({
        queryKey: ["club-info"],
        staleTime: 0,
      }),
    }),
    loadMyClubMembers: builder.fetch<Member[], void>({
      query: () => ({
        url: "/club/my-club/members",
        withAuthorize: true,
      }),
      queryOptions: () => ({
        queryKey: ["club-members"],
        staleTime: 0,
      }),
    }),
    loadClubInstruments: builder.fetch<Instrument[], void>({
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

export const {
  useLoadClubInfoSuspenseFetch,
  useLoadMyClubMembersFetch,
  useLoadClubInstrumentsFetch,
} = clubApi;
