import { baseApi } from "@hongpung/src/common/api";
import { ClubInfo } from "../model/type";

const clubApi = baseApi.addEndpoints({
    endpoints: (builder) => ({
        loadClubInfo: builder.fetch<ClubInfo, void>({
            query: () => ({
                url: '/club/my-club',
                withAuthorize: true
            })
        })
    })

})

export const { useLoadClubInfoFetch } = clubApi;
