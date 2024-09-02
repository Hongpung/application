
export type InstrumentType = '쇠' | '장구' | '북' | '소고' | '새납';
export type club = '들녘' | '산틀' | '신명화랑' | '악반' | '기타'
type Role = "상쇠" | "상장구" | "수북" | "수법고"

export const instrumentOrder = (instrument: InstrumentType) => {
    const instruments = ['쇠', '장구', '북', '소고', '새납'];
    return instruments.indexOf(instrument);
}

export type Instrument = {
    imgURL: string|null// url
    club: '들녘' | '산틀' | '신명화랑' | '악반'
    type: InstrumentType
    name: string
    nickname?: string
    owner?: string//User
    reserves?: any[] | null
    state?: `대여가능` | `분실`
}

export type User = {
    name: string
    nickname?: string
    club: club
    instrument: InstrumentType
    grade: number
    isCapt?: boolean
    addRole?: Role
    badge?: string//url임
}