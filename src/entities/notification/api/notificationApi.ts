import { baseApi } from "@hongpung/src/common";

const notificationApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    deleteNotification: builder.request<void, { notificationId: number }>({
      query: ({ notificationId }) => ({
        url: `/notification/${notificationId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useDeleteNotificationRequest } = notificationApi;