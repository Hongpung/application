
import { baseApi } from "@hongpung/src/common/api";
import { User } from "../model/user";
import { clubIds } from "@hongpung/UserType";
import { ClubName } from "@hongpung/src/common";
import { UserStatusState } from "../model/authState";


const userApi = baseApi.addEndpoints({
    endpoints: (build) => ({

        loadMyStatus: build.fetch<User, void>({
            recoilState: UserStatusState,
            query: () => {
                return {
                    url: '/member/status',
                    withAuthorize: true
                }
            }
        }),

        loadMyClubUsers: build.fetch<User[], void>({
            query: () => {
                return {
                    url: '/club/my-club/members',
                    withAuthorize: true
                }
            }
        }),

        loadInvitibleUsers: build.fetch<User[], { username: string, club: Exclude<ClubName, '기타'>[], startNumber?: string, endNumber?: string }>({
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
        }),

        updateNotificationToken: build.request<void, { NToken: string }>({
            query: ({ NToken }) => ({
                url: '/member/NToken',
                method: 'PATCH',
                body: NToken,
                withAuthorize: true
            })
        })
    })
})


export const { useLoadInvitibleUsersFetch, useLoadMyClubUsersFetch, useLoadMyStatusFetch, useUpdateNotificationTokenRequest } = userApi