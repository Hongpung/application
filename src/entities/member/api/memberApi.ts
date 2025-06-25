import { baseApi } from "@hongpung/src/common/api";
import { Member } from "../model/type";
import { UpdateMyStatusRequestBody } from "./type";

const memberApi = baseApi.addEndpoints({
  endpoints: (build) => ({
    loadMyStatus: build.fetch<Member, void>({
      query: () => {
        return {
          url: "/member/my-status",
          withAuthorize: true,
        };
      },
      queryOptions: () => ({
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        queryKey: ["user-status"],
      }),
    }),
    updateMyStatus: build.request<Member, UpdateMyStatusRequestBody>({
      query: (body) => {
        return {
          url: "/member/my-status",
          method: "PATCH",
          body,
          withAuthorize: true,
          options: {
            headers: {
              "Content-Type": "application/json",
            },
          },
        };
      },
      queryOptions: {
        mutationKey: ["user-status"],
      },
    }),
  }),
});

export const { useLoadMyStatusFetch, useUpdateMyStatusRequest } = memberApi;
