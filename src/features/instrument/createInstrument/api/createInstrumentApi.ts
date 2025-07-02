import { baseApi } from "@hongpung/src/common/api";
import { InstrumentCreateBody } from "./type";

const createInstrumentApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    createInsrument: builder.request<
      { instrumentId: number },
      InstrumentCreateBody
    >({
      query: (requestBody) => ({
        url: "/instrument/create",
        method: "POST",
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

export const { useCreateInsrumentRequest } = createInstrumentApi;
