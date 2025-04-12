import { type Club } from "@src/entities/club/@x/instrument";

export type InstrumentType = '꽹과리' | '장구' | '북' | '소고' | '징' | '기타';

export type Instrument = {
    instrumentId: number
    imageUrl?: string  // url
    name: string
    instrumentType: InstrumentType
    club: Exclude<ClubName, '기타'>
    borrowAvailable: boolean
}