import { Club } from "../@x/club";
import { InstrumentType } from "../model/type";

export type InstrumentDto = {
    instrumentId: number
    imageUrl?: string  // url
    name: string
    instrumentType: InstrumentType
    club: Exclude<Club, '기타'>
    borrowAvailable: boolean,
}

export type InstrumentCreateBody = {
    instrumentType: string
    name: string
    imageUrl?: string
}

export type InstrumentEditBody = {
    instrumentType: string
    name: string
    borrowAvailable: boolean,
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
    club: Exclude<Club, '기타'>
    borrowAvailable: boolean
    borrowHistory: BorrowHistory[]
}