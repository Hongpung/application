import { baseApi } from "@hongpung/src/common/api";
import { NotificationType } from "@hongpung/src/entities/notification/model/type";

const notificationApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    loadNotifications: builder.fetch<NotificationType[], void>({
      query: () => ({
        url: "/notification/my",
      }),
    }),

    deleteAllNotifications: builder.request<void, void>({
      query: () => ({
        url: "/notification/delete/all",
        method: "DELETE",
      }),
    }),
    readAllNotifications: builder.request<void, void>({
      query: () => ({
        url: "/notification/read",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoadNotificationsFetch,
  useDeleteAllNotificationsRequest,
  useReadAllNotificationsRequest,
} = notificationApi;
