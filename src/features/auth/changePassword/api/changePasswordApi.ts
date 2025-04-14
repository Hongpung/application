import { baseApi } from "@hongpung/src/common/api";

const changePasswordAPI = baseApi.addEndpoints({
    endpoints: (builder) => ({
        changePassword: builder.request<{ message: string }, { currentPassword: string; newPassword: string }>({
            query: ({ currentPassword, newPassword }) => ({
                url: "/auth/change-password",
                method: "POST",
                options: { headers: { 'Content-Type': 'application/json' } },
                body: { currentPassword, newPassword },
            }),
        }),
    }),
})

export const { useChangePasswordRequest } = changePasswordAPI;