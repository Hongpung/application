import { baseApi } from "@hongpung/src/common/api";

const notReadNotificationApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    getNotReadNotification: builder.fetch<{ status: boolean }, void>({
      query: () => ({
        url: "/notification/notRead",
        refetchOnFocus: true,
        staleTime: 1000 * 60,
      }),
      queryOptions: (params) => ({
        queryKey: ["not-read-notification"],
      }),
    }),
  }),
});

export const { useGetNotReadNotificationFetch } = notReadNotificationApi;
