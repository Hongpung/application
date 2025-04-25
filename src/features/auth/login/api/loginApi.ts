import { baseApi } from "@hongpung/src/common/api";
import { RequestLoginBody } from "./type";

const loginApi =  baseApi.addEndpoints({
    endpoints: (builder) => ({
        login: builder.request<{ token: string }, RequestLoginBody>({
            query: ({ email, password }) => ({
                url: '/auth/login',
                method: 'POST',
                body: { email, password },
                withAuthorize: false,
                options:{
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            })
        })
    })
})

export const { useLoginRequest } = loginApi;