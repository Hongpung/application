import * as Font from 'expo-font';
import { useCallback, useState } from 'react';

export const useFonts = () => {

    const [fontLoaded, setFontLoaded] = useState(false);

    const loadFonts = useCallback(async () => {
        await fetchFonts();
        setFontLoaded(true);
    }, [])

    const fetchFonts = useCallback(async () => {
        await Font.loadAsync({
            "NanumSquareNeo-Bold": require("../assets/fonts/NanumSquareNeoOTF-Bd.otf"),
            "NanumSquareNeo-ExtraBold": require("../assets/fonts/NanumSquareNeoOTF-Eb.otf"),
            "NanumSquareNeo-Regular": require("../assets/fonts/NanumSquareNeoOTF-Rg.otf"),
            "NanumSquareNeo-Light": require("../assets/fonts/NanumSquareNeoOTF-Lt.otf"),
            "NanumSquareNeo-Heavy": require("../assets/fonts/NanumSquareNeoOTF-Hv.otf")
        })
    }, [])

    return { fontLoaded, loadFonts }
}