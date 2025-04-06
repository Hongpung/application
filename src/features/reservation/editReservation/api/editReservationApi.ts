import { baseApi } from "@hongpung/src/common/api"
import { ReservationEditRequestBody } from "./type"

const editReservationApi = baseApi.addEndpoints({
    endpoints: (builder) => ({

        editReservation: builder.request<void, ReservationEditRequestBody>({
            query: ({ reservationId, ...body }) => {
                return {
                    url: `/reservation/${reservationId}`,
                    withAuthorize: true,
                    method: 'PATCH',
                    body: body
                }
            }
        }),
    })
})

export const { useEditReservationRequest } = editReservationApi