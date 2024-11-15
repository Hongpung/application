
export type InstrumentType = '꽹과리' | '장구' | '북' | '소고' | '징' | '기타';
export const InstrumentTypes: InstrumentType[] = ['꽹과리', '장구', '북', '소고', '징' , '기타']
export const clubsEng: string[] = ['DEULNEOK', 'SANTLE', 'HWARANG', 'AKBAN', 'ETC']//실제로 가야하는 정보

export const instrumentOrder = (instrument: InstrumentType) => {
    const instruments = ['쇠', '장구', '북', '소고', '새납'];
    return instruments.indexOf(instrument);
}

export type club = '들녘' | '산틀' | '화랑' | '악반' | '기타'
export const clubs: club[] = ['들녘', '산틀', '화랑', '악반', '기타']//표시할 정보


type Role = "상쇠" | "상장구" | "수북" | "수법고"

interface borrowHistory {
    borrowerName: string
    borrowerNickname?: string
    borrowDate: string
}

export type briefInstrument = Omit<Instrument, 'borrowHistory'>;

export interface Instrument {
    instrumentId: number
    imgURL?: string  // url
    name: string
    type: InstrumentType
    club: Omit<club, '기타'>
    available: boolean,
    borrowHistory: borrowHistory[]
}

export interface InstrumentCreateDTO{
    type: string
    name: string
}


export interface InstrumentEditDTO{
    type: string
    name: string
    available: boolean,
    imageUrl?: string
}


export interface User {
    memberId: any
    name: string
    nickname?: string
    club: club,
    email: string,
    instrument: InstrumentType
    enrollmentNumber: number
    role?: Role
    profileImageUrl?: string
}

export interface signUpInfo {
    email: string
    name: string
    nickname?: string
    password: string
    club: string
    enrollmentNumber: number
}