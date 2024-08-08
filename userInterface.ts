export interface User {
    name: string
    nickname?: string
    club: '들녘' | '산틀' | '신명화랑' | '악반' | '기타'
    instrument: '쇠' | '장구' | '북' | '소고' | '새납'
    grade: number
    isCapt?: boolean
    addRole?: "상쇠" | "상장구" | "수북" | "수법고";
    badge?:string//url임
}