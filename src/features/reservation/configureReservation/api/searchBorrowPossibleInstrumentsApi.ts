import { baseApi } from "@hongpung/src/common/api";
import { Instrument } from "@hongpung/src/entities/instrument";


const searchBorrowPossibleInstrumentsApi = baseApi.addEndpoints({
    endpoints: (build) => ({
        borrowPossibleInstruments: build.fetch<Instrument[], void>({
            query: () => ({
                url: `/instrument/borrow-list`,
                withAuthorize: true,
            })
        })
    })
})

export const { useBorrowPossibleInstrumentsFetch } = searchBorrowPossibleInstrumentsApi;