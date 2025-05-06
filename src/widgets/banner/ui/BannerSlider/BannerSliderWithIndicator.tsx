import React, { useCallback, useEffect, useRef, useState } from "react";
import { NativeSyntheticEvent, StyleSheet, View, Image } from "react-native";

import PagerView from "react-native-pager-view";

import { Banner, BannerItem, BlankBanner } from "@hongpung/src/entities/banner";
import BannerIndicator from "@hongpung/src/features/banner/ui/BannerIndicator";

type BannerSliderProps = {
  banners: Banner[];
};

const BannerSliderWithIndicator: React.FC<
  BannerSliderProps & { onPressIndicator: () => void }
> = ({ banners, onPressIndicator }) => {
  const pagerRef = useRef<PagerView>(null); //러페런스 추가

  const [bannerIndex, setBannerCount] = useState(0);
  const bannerLength = banners.length; // 배너 수

  const BannerHandler = useCallback(
    (e: NativeSyntheticEvent<{ position: number }>) => {
      const { position } = e.nativeEvent;

      if (position === 0) {
        setBannerCount(banners.length - 1);
        setTimeout(() => {
          pagerRef.current?.setPageWithoutAnimation(banners.length);
        }, 200);
      } else if (position === banners.length + 1) {
        setBannerCount(0);
        setTimeout(() => {
          pagerRef.current?.setPageWithoutAnimation(1);
        }, 200);
      } else {
        setBannerCount(position - 1);
      }
    },
    [banners]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = bannerIndex + 1 + 1; //+1은 보정치 (맨앞에 중첩 배너 있음) +1 은 증가치
      pagerRef.current?.setPage(nextPage);
    }, 5000); // 5초 간격

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
  }, [bannerIndex, bannerLength]);

  return (
    <View>
      <View
        style={{
          flex: 1,
        }}
      >
        {bannerLength == 0 ? (
          <BlankBanner />
        ) : bannerLength > 1 ? (
          <>
            <PagerView
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              initialPage={1}
              onPageSelected={(e) => {
                BannerHandler(e);
              }}
              ref={pagerRef}
            >
              <View style={{ flex: 1 }}>
                <Image
                  src={banners[banners.length - 1].bannerImgUrl}
                  style={{ height: 120, width: "100%", alignItems: "center" }}
                  resizeMode="cover"
                ></Image>
              </View>

              {banners.map((banner, index) => (
                <BannerItem
                  onBannerPress={() => {}}
                  key={`${banner.bannerId}-${index}`}
                  banner={banner}
                />
              ))}

              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, overflow: "hidden" }}>
                  <Image
                    src={banners[0].bannerImgUrl}
                    style={{ height: 120, width: "100%", alignItems: "center" }}
                    resizeMode="cover"
                  ></Image>
                </View>
              </View>
            </PagerView>

            <BannerIndicator
              bannerIndex={bannerIndex}
              bannerLength={bannerLength}
              onPress={onPressIndicator}
            />
          </>
        ) : (
          <BannerItem
            key={`${banners[0].bannerId}-1`}
            banner={banners[0]}
            onBannerPress={() => {}}
          />
        )}
      </View>
    </View>
  );
};

export { BannerSliderWithIndicator };