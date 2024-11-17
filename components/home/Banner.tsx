import { NativeSyntheticEvent, Pressable, StyleSheet, Text, View, Image, Linking } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import PagerView from 'react-native-pager-view'
import { OnPageSelectedEventData } from 'react-native-pager-view/lib/typescript/PagerViewNativeComponent';

import { Icons } from '@hongpung/components/Icon'
import { Color } from '@hongpung/ColorSet'
import { useNavigation } from '@react-navigation/native';

import { MainStackParamList } from '@hongpung/nav/HomeStacks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRecoilValue } from 'recoil';
import { bannersState } from '@hongpung/recoil/bannerState';

interface BannerFetchData {
    id: string
    owner: string
    startDate: string //ISOTimeString
    endDate: string //ISOTimeString
    bannerImgUrl: string
    href?: string
}

type BannerNavParams = NativeStackNavigationProp<MainStackParamList, 'Home'>

const Banner: React.FC<{ withIndicator?: boolean }> = ({ withIndicator = true }) => {

    const navigation = useNavigation<BannerNavParams>()

    const banners = useRecoilValue<{ state: 'BEFORE' | 'PENDING' | 'LOADED' | 'FAILED', value: BannerFetchData[] | null }>(bannersState);
    const [bannerNum, setBannerNum] = useState<number>(0);
    const pagerRef = useRef<PagerView>(null);//러페런스 추가

    console.log(banners)

    const bannerMass = banners.value?.length;// 배너 수

    const BannerHandler = useCallback((e: NativeSyntheticEvent<OnPageSelectedEventData>) => {
        const { position } = e.nativeEvent;

        if (position === 0) {
            setBannerNum(banners.value!.length - 1);
            setTimeout(() => {
                pagerRef.current?.setPageWithoutAnimation(banners.value!.length);
            }, 200)
        } else if (position === banners.value!.length + 1) {
            setBannerNum(0);
            setTimeout(() => {
                pagerRef.current?.setPageWithoutAnimation(1);
            }, 200)
        } else {
            setBannerNum(position - 1)
        }
    }, [banners])
    
    useEffect(() => {
        const interval = setInterval(() => {
            const nextPage = (bannerNum + 1 + 1);//+1은 보정치 (맨앞에 중첩 배너 있음) +1 은 증가치
            pagerRef.current?.setPage(nextPage);
        }, 5000); // 5초 간격

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
    }, [bannerNum, bannerMass]);

    if (banners.state != 'LOADED' || !banners.value) return (
        <View style={styles.bannerContainer}>
            <View style={{
                flex: 1,
            }}>
                <View style={{ flex: 1, backgroundColor: Color['grey300'] }} />
            </View>
        </View >
    )

    return (
        <View style={styles.bannerContainer}>

            <View style={{
                flex: 1,
            }}>{
                    bannerMass == 0 ?
                        <View style={{ flex: 1, backgroundColor: Color['red300'] }}>
                            <View style={{ position: 'absolute', top: 30, left: 22 }}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: '#FFF', fontSize: 20 }}>아직 등록된 배너가 없어요</Text>
                            </View>
                            <View style={{ position: 'absolute', bottom: 30, left: 22 }}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 12 }}>
                                    {`의장에게 배너 등록을 요청할 수 있어요!\n비용은 없습니다!`}
                                </Text>
                            </View>
                        </View>
                        :
                        bannerMass! > 1 ?
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
                                    <Pressable key={index + 1} style={{ flex: 1 }}
                                        onPress={() => { banner.href && Linking.openURL(banner.href) }}>
                                        <Image src={banner.bannerImgUrl} style={{ height: 120, width: '100%', alignItems: 'center' }} resizeMode="cover" />
                                    </Pressable>
                                ))}

                                <View style={{ flex: 1 }}>
                                    <View style={{ flex: 1, overflow: 'hidden' }}>
                                        <Image src={banners.value[0].bannerImgUrl} style={{ height: 120, width: '100%', alignItems: 'center' }} resizeMode="cover"></Image>
                                    </View>
                                </View>

                            </PagerView>
                            :
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, overflow: 'hidden' }}>
                                    <Image src={banners.value[0].bannerImgUrl} style={{ height: 120, width: '100%', alignItems: 'center' }} resizeMode="cover"></Image>
                                </View>
                            </View>

                }
            </View>


            {/* 배너 인디케이터 */}
            {withIndicator && bannerMass != 0 && <View style={{ position: 'absolute', backgroundColor: Color['grey600'], bottom: 8, right: 8, borderRadius: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 2, height: 20, justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: '#FFF', minWidth: 42, fontSize: 12, textAlignVertical: 'center', textAlign: 'right' }}>{bannerNum < 9 ? '0' + (bannerNum + 1) : bannerNum + 1}/{bannerMass! < 10 ? '0' + bannerMass : bannerMass}</Text>
                    <Pressable onPress={() => navigation.navigate('Banners')} style={{ justifyContent: 'flex-end', height: 16, width: 64, gap: 4, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: '#FFF', fontSize: 11, textAlign: 'center' }}>모두보기</Text>
                        <Icons name='chevron-forward-outline' color={Color['grey400']} size={12}></Icons>
                    </Pressable>
                </View>
            </View>}
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