import { baseApi } from "@hongpung/src/common/api";

const notReadNotificationApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    getNotReadNotification: builder.fetch<{ status: boolean }, void>({
      query: () => ({
        url: "/notification/notRead",
      })
    }),
  }),
});

export const { useGetNotReadNotificationFetch } = notReadNotificationApi;
