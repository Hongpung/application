import { baseApi } from "@hongpung/src/common/api"
import { ReservationCreateRequestBody } from "./type"

const createReservationApi = baseApi.addEndpoints({
    endpoints: (build) => ({

        createReservation: build.request<{reservationId:number}, ReservationCreateRequestBody>({
            query: () => {
                return {
                    url: `/reservation`,
                    withAuthorize: true,
                    method: 'POST'
                }
            }
        }),
    })
})

export const { useCreateReservationRequest } = createReservationApi