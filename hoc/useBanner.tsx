import { BannerFetchData } from "@hongpung/components/home/Banner";
import { bannersState } from "@hongpung/recoil/bannerState";
import { useRecoilState } from "recoil";

export const useFetchBanners = () => {
    const [banners, setBanners] = useRecoilState<{ state: 'BEFORE' | 'PENDING' | 'LOADED' | 'FAILED', value: BannerFetchData[] | null }>(bannersState)

    const fetchBanners = async () => {

        setBanners(prev => ({ state: 'PENDING', value: prev.value }))

        const controller = new AbortController();
        const signal = controller.signal;
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        try {

            const bannerData = await fetch(`${process.env.BASE_URL}/banners/on-post`,
                {
                    signal
                }
            )

            if (!bannerData.ok) throw Error();

            const serverData = await bannerData.json() as BannerFetchData[];

            setBanners({ state: 'LOADED', value: serverData })

        } catch (e) {
            console.error(e + '배너 오류');
            setBanners(prev => ({ state: 'FAILED', value: prev.value }))
        } finally {
            clearTimeout(timeoutId);
        }

    };

    return { banners, fetchBanners }
}
