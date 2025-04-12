import { baseApi } from "@hongpung/src/common/api";
import { Member } from "@hongpung/src/entities/member";


const searchInvitePossibleMembersApi = baseApi.addEndpoints({
    endpoints: (build) => ({
        searchInvitePossibleMembers: build.fetch<Member[], { keyword?: string; clubId?: number[], page?: number }>({
            query: ({ page = 0, ...params }) => {

                return {
                    url: `/member/invite-possible`,
                    withAuthorize: true,
                    params: { page, ...params },
                }
            }
        })
    })
})

export const { useSearchInvitePossibleMembersFetch } = searchInvitePossibleMembersApi;