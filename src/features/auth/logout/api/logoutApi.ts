import { baseApi } from "@hongpung/src/common/api";

const logoutApi = baseApi.addEndpoints({
    endpoints: (build) => ({
        logout: build.request<void, void>({
            query: () => ({
                method: 'POST',
                url: '/auth/logout',
            })
        })
    })
})

export const { useLogoutRequest } = logoutApi;