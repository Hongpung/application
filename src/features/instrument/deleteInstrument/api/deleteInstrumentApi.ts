import { baseApi } from "@hongpung/src/common/api";
import { InstrumentDeleteBody } from "./type";

const deleteInstrumentApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    deleteInstrument: builder.request<void, InstrumentDeleteBody>({
      query: (requestBody) => ({
        url: `/instrument/${requestBody.instrumentId}`,
        method: "DELETE",
        withAuthorize: true,
      }),
    }),
  }),
});

export const { useDeleteInstrumentRequest } = deleteInstrumentApi;
