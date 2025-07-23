import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Linking, NativeSyntheticEvent, View } from "react-native";
import PagerView from "react-native-pager-view";
import { Skeleton } from "moti/skeleton";

import { defaultSkeletonConfig } from "@hongpung/src/common";
import {
  BannerItem,
  BlankBanner,
  useLoadBannersFetch,
} from "@hongpung/src/entities/banner";
import { BannerIndicator } from "@hongpung/src/features/banner/manageBanner";

type BannerSliderProps = {
  showAllButton?: boolean;
  onPressIndicator?: () => void;
  onBannerPress?: (bannerUrl: string) => void;
};

export const BannerSlider: React.FC<BannerSliderProps> = ({
  showAllButton = true,
  onPressIndicator = () => {},
  onBannerPress = (bannerUrl: string) => {
    if (bannerUrl) Linking.openURL(bannerUrl);
  },
}) => {
  const { data: banners, isLoading } = useLoadBannersFetch();

  const pagerRef = useRef<PagerView>(null); //러페런스 추가

  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerLength = useMemo(() => banners?.length || 0, [banners]); // 배너 수

  const BannerHandler = useCallback(
    (e: NativeSyntheticEvent<{ position: number }>) => {
      if (!banners) return;
      const { position } = e.nativeEvent;

      if (position === 0) {
        setBannerIndex(bannerLength - 1);
        setTimeout(() => {
          pagerRef.current?.setPageWithoutAnimation(bannerLength);
        }, 200);
      } else if (position === bannerLength + 1) {
        setBannerIndex(0);
        setTimeout(() => {
          pagerRef.current?.setPageWithoutAnimation(1);
        }, 200);
      } else {
        setBannerIndex(position - 1);
      }
    },
    [banners, bannerLength],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = bannerIndex + 1 + 1; //+1은 보정치 (맨앞에 중첩 배너 있음) +1 은 증가치
      pagerRef.current?.setPage(nextPage);
    }, 5000); // 5초 간격

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
  }, [bannerIndex, bannerLength]);

  //ux 개선을 위해 기존 데이터 있으면 로딩 화면 보여주지 않음
  // banner는 전역 상태
  if (isLoading && !banners) {
    return (
      <Skeleton
        {...defaultSkeletonConfig}
        width={"100%"}
        height={120}
        radius={12}
      />
    );
  }

  if (!banners) return null;

  return (
    <View
      style={{ borderRadius: 12, overflow: "hidden", position: "relative" }}
    >
      {bannerLength === 0 ? (
        <BlankBanner />
      ) : (
        <>
          <PagerView
            style={{
              height: 120,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
            initialPage={1}
            onPageSelected={(e) => {
              BannerHandler(e);
            }}
            ref={pagerRef}
          >
            <BannerItem
              onBannerPress={onBannerPress}
              key={`${banners[banners.length - 1].bannerId}-${
                banners.length - 1
              }-start-sub`}
              banner={banners[banners.length - 1]}
            />

            {banners.map((banner, index) => (
              <BannerItem
                onBannerPress={onBannerPress}
                key={`${banner.bannerId}-${index}`}
                banner={banner}
              />
            ))}

            <BannerItem
              onBannerPress={onBannerPress}
              key={`${banners[0].bannerId}-${0}-end-sub`}
              banner={banners[0]}
            />
          </PagerView>
          <BannerIndicator
            bannerIndex={bannerIndex}
            bannerLength={bannerLength}
            onPress={onPressIndicator}
            showAllButton={showAllButton}
          />
        </>
      )}
    </View>
  );
};
