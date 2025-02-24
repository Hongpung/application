import { ClubName } from "@hongpung/src/common"

export interface User {
    memberId: number
    name: string
    nickname?: string
    club: ClubName
    email: string,
    enrollmentNumber: string
    role: string[]
    profileImageUrl?: string
    instagramUrl?: string
    blogUrl?: string
}