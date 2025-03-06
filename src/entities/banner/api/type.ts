export interface BannerDto {
    bannerId: string
    owner: string
    startDate: string //ISOTimeString
    endDate: string //ISOTimeString
    bannerImgUrl: string
    href?: string
    tag?:string
}