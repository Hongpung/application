import { baseApi } from "@hongpung/src/common/api";
import { Notice } from "../model/type";

const noticeApi = baseApi.addEndpoints({
    endpoints: (builder) => ({
        loadNoticeList: builder.fetch<Notice[], void>({
            query: () => ({
                url: "/notice"
            }),
        }),
        loadNoticeDetail: builder.fetch<Notice, { noticeId: number }>({
            query: ({ noticeId }) => ({
                url: `/notice/${noticeId}`
            }),
        }),
    }),
});

export const { useLoadNoticeListFetch, useLoadNoticeDetailFetch } = noticeApi;
