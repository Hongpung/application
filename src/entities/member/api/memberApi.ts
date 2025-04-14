
import { baseApi } from "@hongpung/src/common/api";
import { Member } from "../model/type";
import { clubIds } from "@hongpung/UserType";
import { UserStatusState } from "../model/UserStatusState";


const memberApi = baseApi.addEndpoints({
    endpoints: (build) => ({

        loadMyStatus: build.fetch<Member, void>({
            recoilState: UserStatusState,
            query: () => {
                return {
                    url: '/member/status',
                    withAuthorize: true
                }
            }
        }),

        loadMyClubMembers: build.fetch<Member[], void>({
            query: () => {
                return {
                    url: '/club/my-club/members',
                    withAuthorize: true
                }
            }
        }),

    })
})


export const { useLoadMyClubMembersFetch, useLoadMyStatusFetch } = memberApi