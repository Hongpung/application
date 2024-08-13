import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Color } from '../ColorSet'
import PagerView from 'react-native-pager-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from './pageTypes';
import { debounce } from 'lodash';

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, "Home">;

interface Banner {
    backgroundColor: string,
    Title: string,
    Descript: string
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

    const [bannerNum, setBannerNum] = useState<number>(0);
    const pagerRef = useRef<PagerView>(null);//러페런스 추가

    const user = {
        name: `홍길동`,
        club: `산틀`
    }
    const today = new Date();

    const banners: Banner[] = [
        { backgroundColor: Color[`blue400`], Title: '배너로 활동을 홍보하세요!', Descript: '활동 인원을 모집하고\n공연 관객을 모집해보세요!' },
        { backgroundColor: Color[`green400`], Title: '홍풍 앱 출시 이벤트', Descript: '후기가 담긴 인스타 게시물을 업로드 해주세요\n추첨을 통해 스타벅스 기프티콘을 드립니다' },
        { backgroundColor: Color[`red400`], Title: '홍풍 마당놀이 모집중!', Descript: '2022년 금상, 2023년 대상에 이어 나갈\n홍풍 회원님들을 모집합니다!' },
        { backgroundColor: Color[`blue400`], Title: '배너로 활동을 홍보하세요!', Descript: '활동 인원을 모집하고\n공연 관객을 모집해보세요!' },
        { backgroundColor: Color[`green400`], Title: '홍풍 앱 출시 이벤트', Descript: '후기가 담긴 인스타 게시물을 업로드 해주세요\n추첨을 통해 스타벅스 기프티콘을 드립니다' },
        { backgroundColor: Color[`red400`], Title: '홍풍 마당놀이 모집중!', Descript: '2022년 금상, 2023년 대상에 이어 나갈\n홍풍 회원님들을 모집합니다!' }
    ];

    const bannerMass = banners.length;// 배너 수

    const BannerHandler = (e: any) => {
        const { position } = e.nativeEvent;
        
        if (position === 0) {
            pagerRef.current?.setPageWithoutAnimation(banners.length + 1);
            setBannerNum(banners.length - 1)

        } else if (position === banners.length + 1) {
            pagerRef.current?.setPageWithoutAnimation(1);
            setBannerNum(0)
        } else {
            setBannerNum(position - 1)
        }
    }


    useEffect(() => {

    }, [])

    return (
        <ScrollView style={styles.container}>

            {/* 상단 아이콘 부분*/}
            <View style={styles.iconsRow}>
                <View style={styles.iconContainer}>
                    <Pressable
                        style={styles.icons}
                        onPress={() => { navigation.navigate('Notification'); }}>
                        <Text>Bell</Text>
                    </Pressable>
                    <Pressable
                        style={styles.icons}
                        onPress={() => { navigation.navigate('MyPage'); }}>
                        <Text>Profile</Text>
                    </Pressable>
                </View>
            </View>

            {/* 상단 문구*/}
            <View style={styles.textRow}>
                <Text style={styles.dateText}>{today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일</Text>
                <Text style={styles.greetingText}>{user.name}님 안녕하세요</Text>
            </View>

            {/* 상단 일정*/}
            <Pressable onPress={() => navigation.push(`MySchedules`)}>
                <View style={styles.ScheduleOfDate}>
                    <View style={{ position: 'absolute', bottom: 12, left: 20 }}>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14 }}>오늘의 일정이 없어요</Text>
                        <View style={{ height: 4 }} />
                        <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: '#FFF', fontSize: 18 }}>새로운 일정 예약하러 가기</Text>
                    </View>
                </View>
            </Pressable>

            {/* 배너 부분*/}
            <View style={styles.AdvertiseBanner}>
                {/* 배너 확인 */}
                <View style={{
                    flex: 1,
                }}>
                    <PagerView style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} initialPage={1}
                        onPageSelected={(e) => {
                            BannerHandler(e)
                        }}
                        ref={pagerRef}>
                        <View style={[{ flex: 1, backgroundColor: banners[banners.length - 1].backgroundColor }]}>
                            <View style={{ position: 'absolute', top: 36, left: 22 }}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: '#FFF', fontSize: 20 }}>{banners[banners.length - 1].Title}</Text>
                            </View>

                            <View style={{ position: 'absolute', bottom: 36, left: 22 }}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 12 }}>{banners[banners.length - 1].Descript}</Text>
                            </View>
                        </View>
                        {banners.map((page, index) => (
                            <View key={index + 1} style={{ flex: 1 }}>
                                <View style={[{ flex: 1, backgroundColor: page.backgroundColor }]}>
                                    <View style={{ position: 'absolute', top: 36, left: 22 }}>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: '#FFF', fontSize: 20 }}>{page.Title}</Text>
                                    </View>

                                    <View style={{ position: 'absolute', bottom: 36, left: 22 }}>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 12 }}>{page.Descript}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                        <View style={[{ flex: 1, backgroundColor: banners[0].backgroundColor }]}>
                            <View style={{ position: 'absolute', top: 36, left: 22 }}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: '#FFF', fontSize: 20 }}>{banners[0].Title}</Text>
                            </View>

                            <View style={{ position: 'absolute', bottom: 36, left: 22 }}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 12 }}>{banners[0].Descript}</Text>
                            </View>
                        </View>
                    </PagerView>
                </View>

                {/* 배너 인디케이터 */}
                <View style={{ position: 'absolute', backgroundColor: Color['grey600'], bottom: 8, right: 8, borderRadius: 50, flexDirection: 'row', alignItems: 'center', width: 92, height: 20, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 88, height: 16 }}>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: '#FFF', width: 36, paddingLeft: 4, fontSize: 10, textAlignVertical: 'center', textAlign: 'right' }}>{bannerNum < 9 ? '0' + (bannerNum + 1) : bannerNum + 1}/{bannerMass < 10 ? '0' + bannerMass : bannerMass}</Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: '#FFF', fontSize: 10, width: 56, textAlignVertical: 'center', textAlign: 'center' }}>모두보기 +</Text>
                    </View>
                </View>
            </View>


            {/* 우리 동아리 */}
            <View style={{ marginHorizontal: 24, marginTop: 32, }}>
                <Text style={{
                    fontSize: 18,
                    fontFamily: 'NanumSquareNeo-Bold',
                    marginBottom: 12,
                    marginHorizontal: 4
                }}>
                    우리 동아리
                </Text>
                <TouchableOpacity activeOpacity={0.85}
                    onPress={() => navigation.navigate('MyClub')}>
                    <View style={{ height: 120, backgroundColor: Color['grey300'], borderRadius: 10 }} />
                </TouchableOpacity>
            </View>


            {/* 일정 홍보 */}
            <View style={{ marginTop: 32 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 20, alignItems: 'flex-end', marginHorizontal: 28, marginBottom: 16 }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'NanumSquareNeo-Bold',
                        height: 20
                    }}>
                        인원을 모으는 중인 활동
                    </Text>

                    <Pressable>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'NanumSquareNeo-Light',
                            height: 16
                        }}>
                            더 알아보기 {'>'}
                        </Text>
                    </Pressable>
                </View>

                <ScrollView style={{ height: 126, }} horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ marginLeft: 18 }} />
                        {
                            Array(18).fill(null).map((_, index) => (
                                <View
                                    key={index}
                                    style={{ height: 126, width: 136, backgroundColor: Color['grey300'], borderRadius: 10, marginHorizontal: 6 }}
                                />
                            ))
                        }
                        <View
                            key={'last'}
                            style={{ height: 126, width: 82, borderRadius: 10, marginHorizontal: 6, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey400'], fontSize: 16, marginBottom: 8 }}>더보기</Text>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey400'], fontSize: 20 }}>{'->'}</Text>
                        </View>
                    </View>
                    <View style={{ marginRight: 18 }} />
                </ScrollView>
            </View>



            {/* 공연 홍보 */}
            <View style={{ marginTop: 32 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 20, alignItems: 'flex-end', marginHorizontal: 28, marginBottom: 16 }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'NanumSquareNeo-Bold',
                        height: 20
                    }}>
                        공연 홍보
                    </Text>
                    <Pressable>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'NanumSquareNeo-Light',
                            height: 16
                        }}>
                            더 알아보기 {'>'}
                        </Text>
                    </Pressable>
                </View>

                <ScrollView style={{ height: 208, }} horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flex: 1, flexDirection: 'row', }}>
                        <View style={{ marginLeft: 18 }} />
                        {
                            Array(5).fill(null).map((_, index) => (
                                <View
                                    key={index}
                                    style={{ height: 208, width: 136, backgroundColor: Color['grey300'], borderRadius: 10, marginHorizontal: 6 }}
                                />
                            ))
                        }

                        <View
                            key={'last'}
                            style={{ height: 208, width: 82, borderRadius: 10, marginHorizontal: 6, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey400'], fontSize: 16, marginBottom: 8 }}>더보기</Text>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey400'], fontSize: 20 }}>{'->'}</Text>
                        </View>
                        <View style={{ marginRight: 18 }} />
                    </View>
                </ScrollView>
            </View>





            {/* 푸터 */}
            <View style={styles.footer}>
                <Text>
                    여기가 푸터
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'white',
        overflow: 'scroll',
    },
    iconsRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        height: 30,
        paddingHorizontal: 24,
        marginTop: 8
    },
    iconContainer: {
        flexDirection: 'row',
        height: 30,
        width: 78,
        justifyContent: 'space-between'
    },
    icons: {
        width: 36,
        height: 36,
        backgroundColor: Color['grey400']
    },
    textRow: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 24,
        marginTop: 24
    },
    greetingText: {
        position: 'relative',
        textAlign: 'right',
        color: Color['grey800'],
        fontSize: 20,
        fontFamily: 'NanumSquareNeo-Bold',
        marginRight: 4
    },
    dateText: {
        position: 'relative',
        color: Color['grey800'],
        fontSize: 14,
        fontFamily: 'NanumSquareNeo-Regular',
        lineHeight: 16,
        marginLeft: 4
    },
    ScheduleOfDate: {
        marginHorizontal: 26,
        height: 160,
        borderRadius: 10,
        marginTop: 12,
        backgroundColor: Color['green500']
    },
    AdvertiseBanner: {
        marginTop: 28,
        marginHorizontal: 24,
        height: 150,
        borderRadius: 10,
        overflow: 'hidden'
    },
    footer: { marginLeft: 24, height: 120, marginTop: 48, marginBottom: 96 }
});

export default HomeScreen;
