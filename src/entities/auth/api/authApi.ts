import { baseApi } from "@hongpung/src/common/api";
import { RequestLoginBody } from "./type";
import { saveToken } from "@hongpung/src/common";

const authApi = baseApi.addEndpoints({
    endpoints: (build) => ({
        login: build.request<{ token: string }, RequestLoginBody>({
            query: (requestBody) => ({
                url: '/auth/login',
                method: 'POST',
                body: requestBody
            }),
        }),
        logout: build.request<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
                withAuthorize: true
            }),
        })
    })
})

export const { useLoginRequest, useLogoutRequest } = authApi