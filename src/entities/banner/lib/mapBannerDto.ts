import { BannerDto } from "../api/type";
import { Banner } from "../store/type";

export const mapBannerDtoToBanner = (bannerDtos: BannerDto[]): Banner[] => (
    bannerDtos.map(bannerDto => ({
        bannerId: bannerDto.bannerId,
        bannerImgUrl: bannerDto.bannerImgUrl,
        href: bannerDto.href
    })))