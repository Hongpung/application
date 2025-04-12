import { baseApi } from "@hongpung/src/common/api"

const deleteReservationApi = baseApi.addEndpoints({
    endpoints: (builder) => ({

        deleteReservation: builder.request<void, { reservationId: number }>({
            query: ({ reservationId }) => {
                return {
                    url: `/reservation/${reservationId}`,
                    withAuthorize: true,
                    method: 'DELETE'
                }
            }
        }),
    })
})

export const { useDeleteReservationRequest } = deleteReservationApi