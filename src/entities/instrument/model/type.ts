import { Club } from "../@x/club";

export type InstrumentType = '꽹과리' | '장구' | '북' | '소고' | '징' | '기타';

export const instrumentTypeArray: InstrumentType[] = ['꽹과리', '장구', '북', '소고', '징', '기타']

export type Instrument = {
    instrumentId: number
    imageUrl?: string  // url
    name: string
    instrumentType: InstrumentType
    club: Exclude<Club, '기타'>
    borrowAvailable: boolean
}
