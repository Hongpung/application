import { NativeSyntheticEvent, StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Banner, bannersState } from '@hongpung/src/entities/banner'
import { useRecoilValue } from 'recoil'
import PagerView, { PagerViewOnPageScrollEventData } from 'react-native-pager-view'
import { Color } from '@hongpung/src/common'

interface BannerSlideProps {
    banners: Banner[]
}

const BannerSlide: React.FC<{ withIndicator?: boolean }> = ({ withIndicator = true }) => {

    const banners = useRecoilValue(bannersState);

    const [bannerCount, setBannerCount] = useState(0);

    const pagerRef = useRef<PagerView>(null);//러페런스 추가

    const bannerMass = banners.value?.length;// 배너 수

    const BannerHandler = useCallback((e: NativeSyntheticEvent<PagerViewOnPageScrollEventData>) => {
        const { position } = e.nativeEvent;

        if (position === 0) {
            setBannerCount(banners.value!.length - 1);
            setTimeout(() => {
                pagerRef.current?.setPageWithoutAnimation(banners.value!.length);
            }, 200)
        } else if (position === banners.value!.length + 1) {
            setBannerCount(0);
            setTimeout(() => {
                pagerRef.current?.setPageWithoutAnimation(1);
            }, 200)
        } else {
            setBannerCount(position - 1)
        }
    }, [banners])

    useEffect(() => {
        const interval = setInterval(() => {
            const nextPage = (bannerCount + 1 + 1);//+1은 보정치 (맨앞에 중첩 배너 있음) +1 은 증가치
            pagerRef.current?.setPage(nextPage);
        }, 5000); // 5초 간격

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
    }, [bannerCount, bannerMass]);

    if (banners.status != 'LOADED' || !banners.value || !bannerMass) return (
        <View style={styles.bannerContainer}>
            <View style={{
                flex: 1,
            }}>
                <View style={{ flex: 1, backgroundColor: Color['grey300'] }} >
                    <Text>상태:{banners.status} 값:{banners.value ? '정상 값' : '널 들어옴'}</Text>
                </View>
            </View>
        </View >
    )

    return (
        <View style={styles.bannerContainer}>

            <View style={{
                flex: 1,
            }}>
                {
                    bannerMass == 0 ?
                        <BlankBanner />
                        :
                        bannerMass > 1 ?
                            <>

                                <PagerView
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    initialPage={1}
                                    onPageSelected={(e) => {
                                        BannerHandler(e)
                                    }}
                                    ref={pagerRef}>

                                    <View style={{ flex: 1, }}>
                                        <Image src={banners.value[banners.value!.length - 1].bannerImgUrl} style={{ height: 120, width: '100%', alignItems: 'center' }} resizeMode="cover"></Image>
                                    </View>

                                    {banners.value.map((banner, index) => (
                                        <BannerItem
                                            onBannerPress={() =>}
                                            key={`${banner.bannerId}-${index}`} banner={banner} />
                                    ))}

                                    <View style={{ flex: 1 }}>
                                        <View style={{ flex: 1, overflow: 'hidden' }}>
                                            <Image src={banners.value[0].bannerImgUrl} style={{ height: 120, width: '100%', alignItems: 'center' }} resizeMode="cover"></Image>
                                        </View>
                                    </View>

                                </PagerView>
                                {withIndicator &&
                                    <BannerIndicator bannerIdx={bannerCount} bannerMass={bannerMass} />}
                            </>
                            :
                            <BannerItem key={`${banners.value[0].bannerId}-1`} banner={banners.value[0]} />
                }
            </View>
        </View >
    )
}

export { BannerSlide }

const styles = StyleSheet.create({})