import { baseApi } from "@hongpung/src/common/api/baseApi"
import { bannersState, mapBannerDto } from "@hongpung/src/entities/banner";
import { type BannerDto, type Banner } from "@hongpung/src/entities/banner";

const bannerApi = baseApi.addEndpoints({
    endpoints: (build) => ({
        loadBanners: build.fetch<Banner[], void>({
            recoilState: bannersState,
            query: () => ({
                url: '/banners/on-post',
            }),
            transformResponse: (data: BannerDto[]) => mapBannerDto(data)
        })
    })
});

export const { useLoadBannersFetch } = bannerApi