import { baseApi } from "@hongpung/src/common/api";
import { InstrumentDetailDto, InstrumentEditBody } from "./type";

const instrumentApi = baseApi.addEndpoints({
    endpoints: (build) => ({

        editInsrument: build.request<{ instrumentId: number }, InstrumentEditBody>({
            query: ({ instrumentId, ...requestBody }) => ({
                url: `instrument/${instrumentId}`,
                method: 'PATCH',
                body: requestBody,
                withAuthorize: true
            })
        }),

        deleteInsrument: build.request<{ instrumentId: number }, { instrumentId: number }>({
            query: ({ instrumentId }) => ({
                url: `instrument/${instrumentId}`,
                method: 'DELETE',
                withAuthorize: true
            })
        }),
        
        loadInstrumentDetail: build.fetch<InstrumentDetailDto, { instrumentId: number }>({
            query: ({ instrumentId }) => ({
                url: `/instrument/${instrumentId}`,
                withAuthorize: true
            })
        })

    })
})

export const { useDeleteInsrumentRequest, useEditInsrumentRequest, useLoadInstrumentDetailFetch } = instrumentApi