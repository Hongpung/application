
export type InstrumentType = '꽹과리' | '장구' | '북' | '소고' | '징' | '기타';
export const instrumentTypes: InstrumentType[] = ['꽹과리', '장구', '북', '소고', '징', '기타']

export const instrumentOrder = (instrument: InstrumentType) => {
    const instruments = ['꽹과리', '장구', '북', '소고', '징', '기타'];
    return instruments.indexOf(instrument);
}

export type Club = '들녘' | '산틀' | '신명화랑' | '악반' | '기타'
export const clubs: Club[] = ['들녘', '산틀', '신명화랑', '악반', '기타']//표시할 정보
export const clubIds: Record<string, number | null> = { '들녘': 0, '산틀': 1, '신명화랑': 3, '악반': 2, '기타': null }//표시할 정보
export function clubIdMatchName(clubId: string): string {
    switch (clubId) {
        case 'DEULNYEOK':
            return '들녘'
        case 'SANTLE':
            return '산틀'
        case 'AKBAN':
            return '악반'
        case 'HWARANG':
            return '신명화랑'
        default:
            return '개인'
    }
}

type Role = "상쇠" | "상장구" | "수북" | "수법고" | '패원'

interface BorrowHistory {
    borrowerName: string
    borrowerNickname?: string
    borrowDate: string
}

export type InstrumentWithOutBorrowHistory = Omit<Instrument, 'borrowHistory'>;


export interface Instrument {
    instrumentId: number
    imageUrl?: string  // url
    name: string
    instrumentType: InstrumentType
    club: Omit<Club, '기타'>
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

export interface User {
    memberId: number
    name: string
    nickname?: string
    club: Club,
    email: string,
    enrollmentNumber: string
    role: string[]
    profileImageUrl?: string
    instagramUrl?: string
    blogUrl?: string
}

export interface SignUpInfo {
    email: string
    name: string
    nickname?: string
    password: string
    club: string
    enrollmentNumber: number
}