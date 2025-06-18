import { baseApi } from "@hongpung/src/common/api";
import { InstrumentDetailDto, InstrumentEditBody } from "./type";

const instrumentApi = baseApi.addEndpoints({
  endpoints: (build) => ({
    editInsrument: build.request<{ instrumentId: number }, InstrumentEditBody>({
      query: ({ instrumentId, ...requestBody }) => ({
        url: `instrument/${instrumentId}`,
        method: "PATCH",
        body: requestBody,
        withAuthorize: true,
      }),
      queryOptions: {
        mutationKey: ["instrument", "edit"],
      },
    }),

    deleteInsrument: build.request<
      { instrumentId: number },
      { instrumentId: number }
    >({
      query: ({ instrumentId }) => ({
        url: `instrument/${instrumentId}`,
        method: "DELETE",
        withAuthorize: true,
      }),
      queryOptions: {
        mutationKey: ["instrument", "delete"],
      },
    }),

    loadInstrumentDetail: build.fetch<
      InstrumentDetailDto,
      { instrumentId: number }
    >({
      query: ({ instrumentId }) => ({
        url: `/instrument/${instrumentId}`,
        withAuthorize: true,
      }),
      queryOptions: (params) => ({
        queryKey: ["instrument", "detail", params.instrumentId],
        staleTime: 1000 * 60 * 10, // 10분
        gcTime: 1000 * 60 * 10, // 10분
      }),
    }),
  }),
});

export const {
  useDeleteInsrumentRequest,
  useEditInsrumentRequest,
  useLoadInstrumentDetailFetch,
} = instrumentApi;
