
export type InstrumentType = '쇠' | '장구' | '북' | '소고' | '새납';
export const InstrumentTypes: InstrumentType[] = ['쇠', '장구', '북', '소고', '새납']
export type club = '들녘' | '산틀' | '신명화랑' | '악반' | '기타'
export const clubs: club[] = ['들녘', '산틀', '신명화랑', '악반', '기타']
export const clubsEng: string[] = ['DEULNEOK', 'SANTLE', 'HWARANG', 'AKBAN', 'ETC']
type Role = "상쇠" | "상장구" | "수북" | "수법고"

export const instrumentOrder = (instrument: InstrumentType) => {
    const instruments = ['쇠', '장구', '북', '소고', '새납'];
    return instruments.indexOf(instrument);
}

export type Instrument = {
    imgURL: string | null// url
    club: Omit<club, '기타'>,
    type: InstrumentType
    name: string
    nickname?: string
    owner?: string//User
    reserves?: any[] | null
    state?: `대여가능` | `분실`
}

export type User = {
    memberId: any
    name: string
    nickname?: string
    club: club,
    email: string,
    instrument: InstrumentType
    enrollmentNumber: number
    isCapt?: boolean
    role?: Role
    badge?: string//url임
    profileImageUrl?: string
}