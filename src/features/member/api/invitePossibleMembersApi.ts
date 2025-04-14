import { baseApi } from "@hongpung/src/common/api";
import { Member } from "@hongpung/src/entities/member";

const invitePossibleMembersApi = baseApi.addEndpoints({
    endpoints: (builder) => ({
        invitePossibleMembers: builder.fetch<Member[], string>({
            query: (clubId) => ({
                url: `/clubs/${clubId}/invite-possible-members`,
                withAuthorize: true
            }),
        }),
    }),
});

export const { useInvitePossibleMembersFetch } = invitePossibleMembersApi;
