import { baseApi } from "@hongpung/src/common/api/baseApi";
import { bannersState } from "../model/store";
import { mapBannerDtoToBanner } from "../lib/mapBannerDto";
import { type BannerDto, type Banner } from "@hongpung/src/entities/banner";

const bannerApi = baseApi.addEndpoints({
  endpoints: (build) => ({
    loadBanners: build.fetch<Banner[], void>({
      recoilState: bannersState,
      query: () => ({
        url: "/banners/on-post",
      }),
      transformResponse: (data: BannerDto[]) => mapBannerDtoToBanner(data),
    }),
  }),
});

export const { useLoadBannersFetch } = bannerApi;
