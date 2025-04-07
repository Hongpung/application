import { baseApi } from "@hongpung/src/common/api";


const searchInvitePossibleMembersApi = baseApi.addEndpoints({
    endpoints: (build) => ({
        searchInvitePossibleMembers: build.fetch<void, { keyword?: string; clubId?: number[] }>({
            query: ({ keyword, clubId }) => {
                const params = {} as Record<string, any>;

                if (keyword) params['keyword'] = keyword;
                if (clubId) params['clubId'] = clubId;

                return {
                    url: `/member/invite-possible`,
                    withAuthorize: true,
                    params,
                }
            }
        })
    })
})





