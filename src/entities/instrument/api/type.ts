import { Club } from "@hongpung/src/entities/club/@x/instrument";
import { InstrumentType } from "../model/type";

export type InstrumentDto = {
    instrumentId: number
    imageUrl?: string  // url
    name: string
    instrumentType: InstrumentType
    club: Exclude<ClubName, '기타'>
    borrowAvailable: boolean,
}

export type InstrumentEditBody = {
    instrumentId: number
    instrumentType: string
    name: string
    borrowAvailable: boolean
    imageUrl?: string
}

interface BorrowHistory {
    borrowerName: string
    borrowerNickname?: string
    borrowDate: string
}

export type InstrumentDetailDto = {
    instrumentId: number
    imageUrl?: string  // url
    name: string
    instrumentType: InstrumentType
    club: Exclude<ClubName, '기타'>
    borrowAvailable: boolean
    borrowHistory: BorrowHistory[]
}