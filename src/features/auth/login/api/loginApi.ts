import { baseApi } from "@hongpung/src/common/api";
import { RequestLoginBody } from "./type";

const loginApi =  baseApi.addEndpoints({
    endpoints: (builder) => ({
        login: builder.request<{ token: string }, RequestLoginBody>({
            query: ({ email, password }) => ({
                url: '/login',
                method: 'POST',
                body: { email, password }
            })
        })
    })
})

export const { useLoginRequest } = loginApi;