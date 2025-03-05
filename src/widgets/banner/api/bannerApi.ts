import { baseApi } from "@hongpung/src/common/api/baseApi"
import { BannerDto } from "../../../entities/banner/api/type";
import { Banner } from "../../../entities/banner/store/type";
import { mapBannerDtoToBanner } from "../../../entities/banner/lib/mapBannerDto";

const bannerApi = baseApi.addEndpoints((build) => ({
    endpoints: {
        loadBanners: build.query<Banner[], null>({
            query: () => ({
                url: '/banners/on-post',
            }),
            transformResponse:(data:BannerDto[])=> mapBannerDtoToBanner(data)
        })
    }
}));

export const { useLoadBannersFetch } = bannerApi