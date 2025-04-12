import { baseApi } from "@hongpung/src/common/api";
import { InstrumentCreateBody } from "./type";

const createInstrumentApi = baseApi.addEndpoints({
    endpoints: (builder) => ({
        createInsrument: builder.request<{ instrumentId: number }, InstrumentCreateBody>({
            query: (requestBody) => ({
                url: '',
                method: 'POST',
                body: requestBody,
                withAuthorize: true
            })
        }),
    })
})

export const { useCreateInsrumentRequest } = createInstrumentApi