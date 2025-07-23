import { baseApi } from "@hongpung/src/common/api";
import { BriefNotice } from "@hongpung/src/entities/notice/model/type";

const noticeWidgetsApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    getNoticeList: builder.fetch<BriefNotice[], void>({
      query: () => ({ url: "/notice", refetchOnFocus: true }),
      queryOptions: (params) => ({
        queryKey: ["notice-list"],
      }),
    }),
  }),
});

export const { useGetNoticeListFetch } = noticeWidgetsApi;
