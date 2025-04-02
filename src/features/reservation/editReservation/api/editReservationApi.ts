import { baseApi } from "@hongpung/src/common/api"
import { ReservationEditRequestBody } from "./type"

const editReservationApi = baseApi.addEndpoints({
    endpoints: (build) => ({

        editReservation: build.request<void, ReservationEditRequestBody>({
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