import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

interface BannerFetchData {
    id: string
    owner: string
    startDate: string //ISOTimeString
    endDate: string //ISOTimeString
    bannerImgUrl: string
    href?: string
}

export default function useBannerFetch(): [banners: BannerFetchData[], isLoading: boolean] {
    const [banners, setBanners] = useState<BannerFetchData[]>([])
    const [isLoading, setLoading] = useState(false)
    useEffect(() => {
        const fetchBanner = async () => {
            setLoading(true)
            const cachedData = await AsyncStorage.getItem('BANNER_CACHED_DATA');
            const cachedBanners = cachedData ? JSON.parse(cachedData) as BannerFetchData[] : null;


            const cachedVersion = await AsyncStorage.getItem('BANNER_VERSION');
            const versionData = await fetch(`${process.env.WEB_API}/banners/version`, {})

            if (!versionData.ok) throw Error();

            const { version } = await versionData.json();

            if (!cachedBanners || cachedVersion !== version) {
                // 서버 데이터가 최신일 때 캐시 업데이트
                try {

                    await AsyncStorage.setItem('BANNER_VERSION', JSON.stringify(version));

                    const bannerData = await fetch(`${process.env.WEB_API}/banners/public`, {})

                    if (!bannerData.ok) throw Error();

                    const serverData = await bannerData.json() as BannerFetchData[];
                    await AsyncStorage.setItem('BANNER_CACHED_DATA', JSON.stringify(serverData));

                    setBanners(serverData)
                }
                catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false)
                }
            }
            else {
                setBanners(cachedBanners)
                setLoading(false)
            }
        };
        fetchBanner();
    }, [])

    return [banners, isLoading]
}