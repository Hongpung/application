import { InstrumentType } from "@hongpung/src/entities/instrument"

export interface InstrumentEditBody {
    instrumentId: number
    name: string
    instrumentType: InstrumentType
    borrowAvailable: boolean
    imageUrl?: string
} 