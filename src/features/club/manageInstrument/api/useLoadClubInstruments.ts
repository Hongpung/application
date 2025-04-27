import { baseApi } from '@hongpung/src/common/api/baseApi'
import { Instrument } from '@hongpung/src/entities/instrument/@x/reservation'

export const useLoadClubInstruments = () => {
    return baseApi.addEndpoints({
        endpoints: (build) => ({
            loadClubInstruments: build.fetch<Instrument[], void>({
                query: () => ({
                    url: '/club/my-club/instruments',
                    withAuthorize: true
                })
            })
        })
    })
} 

export const { useLoadClubInstrumentsFetch } = useLoadClubInstruments();
