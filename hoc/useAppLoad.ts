import { useFetchBanners } from "@hongpung/hoc/useBanner";
import { useFirstPage } from "@hongpung/hoc/useFirstPage";
import { useFonts } from "./useFonts";
import { useAuth } from "@hongpung/hoc/useAuth";
import { useCallback, useEffect } from "react";

export const useAppLoad = () => {

    const { firstScreen, defineFirstScreen } = useFirstPage();
    const { banners, fetchBanners } = useFetchBanners();
    const { fontLoaded, loadFonts } = useFonts();

    const { logout } = useAuth()

    const initProcess = useCallback(() => {

        loadFonts();
        defineFirstScreen();
        fetchBanners();

    }, [])

    useEffect(() => {

        initProcess();

        return () => {

            logout();

        }
    }, [])

    return { firstScreen, fontLoaded, banners };
}