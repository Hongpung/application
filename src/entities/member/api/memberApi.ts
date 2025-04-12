
import { baseApi } from "@hongpung/src/common/api";
import { Member } from "../model/type";
import { clubIds } from "@hongpung/UserType";
import { UserStatusState } from "../model/authState";


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

        loadInvitibleMembers: build.fetch<Member[], { username: string, club: Exclude<ClubName, '기타'>[], startNumber?: string, endNumber?: string }>({
            query: (queryParams) => {
                const { club, ...params } = queryParams;

                if (club.length > 0) {
                    const clubId = club.map(club => clubIds[club]!.toString()).filter(Boolean); // undefined 방지

                    return {
                        url: '/member/invite-possible',
                        params: { ...params, clubId }, // 새로운 객체로 병합
                        withAuthorize: true
                    };
                }

                return {
                    url: '/member/invite-possible',
                    params: { ...params },
                    withAuthorize: true
                }
            }
        })
    })
})


export const { useLoadInvitibleMembersFetch, useLoadMyClubMembersFetch, useLoadMyStatusFetch } = memberApi