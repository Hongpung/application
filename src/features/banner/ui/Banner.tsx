import { NativeSyntheticEvent, StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useRecoilValue } from 'recoil';
import { bannersState } from '@src/entities/banner';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PagerView from 'react-native-pager-view';
import { OnPageSelectedEventData } from 'react-native-pager-view/lib/typescript/specs/PagerViewNativeComponent';

import { Color } from '@hongpung/ColorSet';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';
import BannerItem from './banner-item';
import BannerIndicator from './banner-indicator';


type BannerNavParams = NativeStackNavigationProp<MainStackParamList, 'Home'>


const BlankBanner: React.FC = () => {
    return (
        <View style={{ flex: 1, backgroundColor: Color['red300'] }}>
            <View style={{ position: 'absolute', top: 30, left: 22 }}>
                <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: '#FFF', fontSize: 20 }}>아직 등록된 배너가 없어요</Text>
            </View>
            <View style={{ position: 'absolute', bottom: 30, left: 22 }}>
                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 12 }}>
                    {`의장에게 배너 등록을 요청할 수 있어요!\n별도의 비용은 없습니다.`}
                </Text>
            </View>
        </View>
    )
}

const Banner: React.FC<{ withIndicator?: boolean }> = ({ withIndicator = true }) => {

    const banners = useRecoilValue(bannersState);

    const [bannerCount, setBannerCount] = useState(0);

    const pagerRef = useRef<PagerView>(null);//러페런스 추가

    const bannerMass = banners.value?.length;// 배너 수

    const BannerHandler = useCallback((e: NativeSyntheticEvent<OnPageSelectedEventData>) => {
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
                                            onBannerPress={()=>}
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

export default Banner

const styles = StyleSheet.create({
    bannerContainer: {
        height: 120,
        borderRadius: 10,
        overflow: 'hidden'
    }
})