import { baseApi } from '@hongpung/src/common/api/baseApi'
import { Instrument } from '@hongpung/src/entities/instrument/@x/reservation'

export const useLoadClubInstruments = () => {
    return baseApi.addEndpoints({
        endpoints: (build) => ({
            loadClubInstruments: build.fetch<Instrument[], void>({
                query: () => ({
                    url: '/instrument/club',
                    withAuthorize: true
                })
            })
        })
    })
} 

export const { useLoadClubInstrumentsFetch } = useLoadClubInstruments();
