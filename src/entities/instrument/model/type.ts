export type Instrument = {
    instrumentId: number
    imageUrl?: string  // url
    name: string
    instrumentType: InstrumentType
    club: Exclude<ClubName, '기타'>
    borrowAvailable: boolean
}