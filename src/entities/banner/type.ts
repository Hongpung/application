export interface BannerDto {
    bannerId: string
    owner: string
    startDate: string //ISOTimeString
    endDate: string //ISOTimeString
    bannerImgUrl: string
    href?: string
}

export type BannerFetchStatus = | {
    status: 'BEFORE' | 'PENDING' | 'FAILED',
    value: null
} | {
    status: 'LOADED',
    value: BannerDto[]
}