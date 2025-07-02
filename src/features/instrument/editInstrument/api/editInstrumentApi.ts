import { baseApi } from "@hongpung/src/common/api";
import { InstrumentEditBody } from "./type";

const editInstrumentApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    editInstrument: builder.request<
      { instrumentId: number },
      InstrumentEditBody
    >({
      query: (requestBody) => ({
        url: `/instrument/${requestBody.instrumentId}`,
        method: "PATCH",
        body: requestBody,
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
        withAuthorize: true,
      }),
    }),
  }),
});

export const { useEditInstrumentRequest } = editInstrumentApi;
