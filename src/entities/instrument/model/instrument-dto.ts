import { Club } from "../@x/club";
import { InstrumentType } from "./instrument-type";


interface BorrowHistory {
    borrowerName: string
    borrowerNickname?: string
    borrowDate: string
}

export type InstrumentWithOutBorrowHistory = Omit<InstrumentDto, 'borrowHistory'>;

export interface InstrumentDto {
    instrumentId: number
    imageUrl?: string  // url
    name: string
    instrumentType: InstrumentType
    club: Exclude<Club, '기타'>
    borrowAvailable: boolean,
    borrowHistory: BorrowHistory[]
}

export interface InstrumentCreateDTO {
    instrumentType: string
    name: string
    imageUrl?: string
}

export interface InstrumentEditDTO {
    instrumentType: string
    name: string
    borrowAvailable: boolean,
    imageUrl?: string
}