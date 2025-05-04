import { baseApi } from "@hongpung/src/common/api";
import { Member } from "../model/type";
import { UserStatusState } from "../model/UserStatusState";

const memberApi = baseApi.addEndpoints({
  endpoints: (build) => ({
    loadMyStatus: build.fetch<Member, void>({
      stateKey: UserStatusState,
      query: () => {
        return {
          url: "/member/my-status",
          withAuthorize: true,
        };
      },
    }),
  }),
});

export const { useLoadMyStatusFetch } = memberApi;
