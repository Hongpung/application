import { baseApi } from "@hongpung/src/common/api";

const manageRoomApi = baseApi.addEndpoints({
    endpoints: (builder) => ({
        extendSession: builder.request<{ message: string }, void>({
            query: () => ({
                url: `/session/extend`,
                method: "POST",
            })
        })
    })
})

export const { useExtendSessionRequest } = manageRoomApi
