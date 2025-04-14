import { baseApi } from "@hongpung/src/common/api";

const notificationTokenApi = baseApi.addEndpoints({
    endpoints: (build) => ({
        updateNotificationStatus: build.request<void, { pushEnable: boolean, notificationToken: null | string }>({
            query: (body) => ({
                url: `/member/NToken`,
                method: "PATCH",
                options: {
                    headers: {
                        "Content-Type": "application/json",
                    }
                },
                body
            }),
        }),
    })
})

export const { useUpdateNotificationStatusRequest } = notificationTokenApi;
