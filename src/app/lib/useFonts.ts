import * as Font from "expo-font";
import { useEffect, useState } from "react";

export const useFonts = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const fetchFonts = async () => {
      await Font.loadAsync({
        "NanumSquareNeo-Bold": require("@hongpung/assets/fonts/NanumSquareNeoOTF-Bd.otf"),
        "NanumSquareNeo-ExtraBold": require("@hongpung/assets/fonts/NanumSquareNeoOTF-Eb.otf"),
        "NanumSquareNeo-Regular": require("@hongpung/assets/fonts/NanumSquareNeoOTF-Rg.otf"),
        "NanumSquareNeo-Light": require("@hongpung/assets/fonts/NanumSquareNeoOTF-Lt.otf"),
        "NanumSquareNeo-Heavy": require("@hongpung/assets/fonts/NanumSquareNeoOTF-Hv.otf"),
      });
    };

    const loadFonts = async () => {
      await fetchFonts();
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  return { fontLoaded };
};
