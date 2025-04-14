import { baseApi } from "@hongpung/src/common/api";
import { NotificationType } from "@hongpung/src/entities/notification/model/type";

const notificationApi = baseApi.addEndpoints({
    endpoints: (builder) => ({
        loadNotifications: builder.fetch<NotificationType[], void>({
            query: () => ({
                url: "/notification/my",
            })
        }),
        deleteNotification: builder.request<void, { notificationId: number }>({
            query: ({ notificationId }) => ({
                url: `/notification/delete/${notificationId}`,
                method: "DELETE",
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

export const { useLoadNotificationsFetch,
    useDeleteNotificationRequest, useDeleteAllNotificationsRequest,
    useReadAllNotificationsRequest } = notificationApi;
