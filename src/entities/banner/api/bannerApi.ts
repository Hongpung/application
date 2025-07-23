import { baseApi } from "@hongpung/src/common/api/baseApi";
import { mapBannerDtoToBanner } from "../lib/mapBannerDto";
import { type BannerDto, type Banner } from "@hongpung/src/entities/banner";

const bannerApi = baseApi.addEndpoints({
  endpoints: (build) => ({
    loadBanners: build.fetch<Banner[], void>({
      query: () => ({
        url: "/banners/on-post",
      }),
      transformResponse: (data: BannerDto[]) => mapBannerDtoToBanner(data),
      queryOptions: () => ({
        queryKey: ["banners"],
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60,
      }),
    }),
  }),
});

export const { useLoadBannersFetch } = bannerApi;
