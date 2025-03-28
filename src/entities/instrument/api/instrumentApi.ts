import { baseApi } from "@hongpung/src/common/api";
import { InstrumentCreateBody, InstrumentDto, InstrumentEditBody } from "./type";

const instrumentApi = baseApi.addEndpoints({
    endpoints: (build) => ({
        createInsrument: build.request<{ instrumentId: number }, { instrumentId: number } & InstrumentCreateBody>({
            query: (requestBody) => ({
                url: '',
                method: 'POST',
                body: requestBody,
                withAuthorize: true
            })
        }),
        editInsrument: build.request<{ instrumentId: number }, { instrumentId: number } & InstrumentEditBody>({
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
        })
    })
})

export const { useCreateInsrumentRequest, useDeleteInsrumentRequest, useEditInsrumentRequest } = instrumentApi