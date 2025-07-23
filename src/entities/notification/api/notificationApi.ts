import { baseApi } from "@hongpung/src/common";

const notificationApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    deleteNotification: builder.request<void, { notificationId: number }>({
      query: ({ notificationId }) => ({
        url: `/notification/delete/${notificationId}`,
        method: "DELETE",
      }),
      queryOptions: {
        mutationKey: ["notification"],
      },
    }),
  }),
});

export const { useDeleteNotificationRequest } = notificationApi;
