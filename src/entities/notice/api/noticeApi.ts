import { baseApi } from "@hongpung/src/common/api";
import { Notice } from "../model/type";

const noticeApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    loadNoticeList: builder.fetch<Notice[], void>({
      query: () => ({
        url: "/notice",
      }),
      queryOptions: () => ({
        queryKey: ["notice-list"],
      }),
    }),
    loadNoticeDetail: builder.fetch<Notice, { noticeId: number }>({
      query: ({ noticeId }) => ({
        url: `/notice/${noticeId}`,
      }),
      queryOptions: (params) => ({
        staleTime: 0,
        queryKey: ["notice-detail", params.noticeId],
      }),
    }),
  }),
});

export const { useLoadNoticeListFetch, useLoadNoticeDetailFetch } = noticeApi;
