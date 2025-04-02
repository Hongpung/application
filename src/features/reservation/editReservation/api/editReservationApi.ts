import { baseApi } from "@hongpung/src/common/api"
import { ReservationEditRequestBody } from "./type"

const editReservationApi = baseApi.addEndpoints({
    endpoints: (build) => ({

        editReservation: build.request<void, ReservationEditRequestBody>({
            query: ({ reservationId }) => {
                return {
                    url: `/reservation/${reservationId}`,
                    withAuthorize: true,
                    method: 'PATCH',
                }
            }
        }),
    })
})

export const { useEditReservationRequest } = editReservationApi