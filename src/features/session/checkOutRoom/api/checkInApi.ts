import { baseApi } from "@hongpung/src/common/api/baseApi";
import { CheckOutBody } from "./type";

const checkOutApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    endSession: builder.request<{ message: string }, CheckOutBody>({
      query: (body) => ({
        url: `/session/end`,
        withAuthorize: true,
        method: "POST",
        body,
        options: { headers: { "Content-Type": "application/json" } },
      }),
    }),
  }),
});

export const { useEndSessionRequest } = checkOutApi;
