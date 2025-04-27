import { baseApi } from "@hongpung/src/common/api";
import { BriefNotice } from "@hongpung/src/entities/notice/model/type";

const noticeWidgetsApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    getNoticeList: builder.fetch<BriefNotice[], void>({
      query: () => ({ url: "/notice" }),
    }),
  }),
});

export const { useGetNoticeListFetch } = noticeWidgetsApi;