import { ClubName } from "@hongpung/src/common"

export type Club ={
    clubName: ClubName
    clubId: number
}

export const clubIds: Record<string, number | null> = { '들녘': 0, '산틀': 1, '신명화랑': 3, '악반': 2, '기타': null }//표시할 정보