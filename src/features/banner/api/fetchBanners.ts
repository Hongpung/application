import { BannerDto, bannerApi } from "@hongpung/src/entities/banner";

export default async function fetchBanners() {

    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const { url, method } = bannerApi.loadBanners;

    try {

        const bannerData = await fetch(url,
            {
                method,
                signal
            }
        )

        if (!bannerData.ok) throw Error();

        const serverData = await bannerData.json() as BannerDto[];

        return serverData

    } catch (e) {

        console.error(e + '배너 오류');
        throw Error('배너 정보 불러오기 실패')

    } finally {
        clearTimeout(timeoutId);
    }

};