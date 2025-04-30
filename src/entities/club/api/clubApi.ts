import { baseApi } from "@hongpung/src/common/api";
import type { ClubInfo } from "../model/type";
import type { Member } from "@hongpung/src/entities/member/@x/club";
import type { Instrument } from "@hongpung/src/entities/instrument/@x/club";

const clubApi = baseApi.addEndpoints({
    endpoints: (builder) => ({
        loadClubInfo: builder.fetch<ClubInfo, void>({
            query: () => ({
                url: '/club/my-club',
                withAuthorize: true
            })
        }),
        loadMyClubMembers: builder.fetch<Member[], void>({
            query: () => {
                return {
                    url: '/club/my-club/members',
                    withAuthorize: true
                }
            }
        }),
        loadClubInstruments: builder.fetch<Instrument[], void>({
            query: () => ({
                url: '/club/my-club/instruments',
                withAuthorize: true
            })
        })
    })

})

export const { useLoadClubInfoFetch, useLoadMyClubMembersFetch, useLoadClubInstrumentsFetch } = clubApi;
