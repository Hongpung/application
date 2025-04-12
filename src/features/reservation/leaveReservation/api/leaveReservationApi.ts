import { baseApi } from "@hongpung/src/common/api"

const leaveReservationApi = baseApi.addEndpoints({
    endpoints: (builder) => ({

        leaveReservation: builder.request<void, { reservationId: number }>({
            query: ({ reservationId }) => {
                return {
                    url: `/reservation/${reservationId}/leave`,
                    withAuthorize: true,
                    method: 'POST'
                }
            }
        }),
    })
})

export const { useLeaveReservationRequest } = leaveReservationApi