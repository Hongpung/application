import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, Modal, FlatList, Animated, NativeSyntheticEvent } from 'react-native';
import { Color } from '@hongpung/ColorSet'
import PagerView from 'react-native-pager-view';
import { debounce } from 'lodash';
import { OnPageSelectedEventData } from 'react-native-pager-view/lib/typescript/PagerViewNativeComponent';
import { useAuth } from '@hongpung/hoc/useAuth';
import { Icons } from '@hongpung/components/Icon';
import { useUserReserve } from '@hongpung/hoc/useUserReserve';
import { useRecoilValue } from 'recoil';
import { loginUserState } from '@hongpung/recoil/authState';

interface Banner {
    backgroundColor: string,
    Title: string,
    Descript: string
}

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

    const { getUserInfo } = useAuth();
    const loginUser = useRecoilValue(loginUserState);
    const { userReservations, loadUserReservation } = useUserReserve();

    console.log(userReservations)
    const hasReservation = useMemo(() => userReservations.length > 0, [userReservations])
    const [isUsed, setUsed] = useState(true);
    const [isSlideUp, setSlide] = useState(false);
    const [bannerNum, setBannerNum] = useState<number>(0);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const pagerRef = useRef<PagerView>(null);//러페런스 추가
    const today = new Date();
    const animatedValue = useRef(new Animated.Value(-82)).current; // 초기 bottom 값

    const toggleBottomSheet = () => {
        if (isSlideUp) {
            // 바텀 시트 닫기
            Animated.timing(animatedValue, {
                toValue: -82, // 닫을 때 bottom 위치 (화면 아래로 숨기기)
                duration: 200,
                useNativeDriver: false,
            }).start(() => setSlide(false));
        } else {
            setSlide(true);
            // 바텀 시트 열기
            Animated.timing(animatedValue, {
                toValue: 0, // 열릴 때 bottom 위치
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    };

    const banners: Banner[] = [
        { backgroundColor: Color[`blue400`], Title: '배너로 활동을 홍보하세요!', Descript: '활동 인원을 모집하고\n공연 관객을 모집해보세요!' },
        { backgroundColor: Color[`green400`], Title: '홍풍 앱 출시 이벤트', Descript: '후기가 담긴 인스타 게시물을 업로드 해주세요\n추첨을 통해 스타벅스 기프티콘을 드립니다' },
        { backgroundColor: Color[`red400`], Title: '홍풍 마당놀이 모집중!', Descript: '2022년 금상, 2023년 대상에 이어 나갈\n홍풍 회원님들을 모집합니다!' },
    ];

    const bannerMass = banners.length;// 배너 수

    const BannerHandler = (e: NativeSyntheticEvent<OnPageSelectedEventData>) => {
        const { position } = e.nativeEvent;

        if (position === 0) {
            setBannerNum(banners.length - 1);
            setTimeout(() => {
                pagerRef.current?.setPageWithoutAnimation(banners.length);
            }, 200)
        } else if (position === banners.length + 1) {
            setBannerNum(0);
            setTimeout(() => {
                pagerRef.current?.setPageWithoutAnimation(1);
            }, 200)
        } else {
            setBannerNum(position - 1)
        }
    }


    useEffect(() => {
        const loadUserinfo = async () => {
            await getUserInfo();
        }

        const loadReservationData = async () => {
            await loadUserReservation();
        }

        setUsed(false)

        if (!loginUser) {
            loadUserinfo();
            loadReservationData();
        }
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* 상단 아이콘 부분*/}
                <View style={styles.iconsRow}>
                    <View style={styles.iconContainer}>
                        <Pressable
                            style={styles.icons}
                            onPress={() => { navigation.navigate('Notification'); }}>
                            <Icons size={28} name={'notifications'} color={Color['blue500']} />
                            {true && <View style={{ position: 'absolute', width: 8, height: 8, backgroundColor: 'orange', bottom: 4, right: 4, borderRadius: 100 }} />}
                        </Pressable>
                        <Pressable
                            style={styles.icons}
                            onPress={() => { navigation.navigate('MyPage'); }}>
                            <Icons size={32} name={'person'} color={Color['blue500']} />
                        </Pressable>
                    </View>
                </View>

                {/* 상단 문구*/}
                <View style={styles.textRow}>
                    <Text style={styles.dateText}>{today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일</Text>
                    <Text style={styles.greetingText}>{loginUser?.name}님 안녕하세요</Text>
                </View>

                {/* 상단 일정*/}
                <Pressable onPress={() => debounce(() => navigation.push('ReserveCalendar'), 1000, { leading: true, trailing: false })}>
                    <View style={styles.ScheduleOfDate}>
                        {hasReservation ?
                            <TouchableOpacity style={{ position: 'absolute', bottom: 12, left: 20 }}
                                onPress={() => navigation.navigate('MyPage', { screen: 'MySchedules' })}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14 }}>오늘의 일정이 있어요</Text>
                                <View style={{ height: 4 }} />
                                <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: '#FFF', fontSize: 18 }}>예약 확인하러 가기</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity style={{ position: 'absolute', bottom: 12, left: 20 }}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14 }}>오늘의 일정이 없어요</Text>
                                <View style={{ height: 4 }} />
                                <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: '#FFF', fontSize: 18 }}>새로운 일정 예약하러 가기</Text>
                            </TouchableOpacity>}
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
                    <View style={{ position: 'absolute', backgroundColor: Color['grey600'], bottom: 8, right: 8, borderRadius: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 2, height: 20, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: '#FFF', minWidth: 42, fontSize: 12, textAlignVertical: 'center', textAlign: 'right' }}>{bannerNum < 9 ? '0' + (bannerNum + 1) : bannerNum + 1}/{bannerMass < 10 ? '0' + bannerMass : bannerMass}</Text>
                            <Pressable onPress={() => setModalVisible(true)} style={{ justifyContent: 'flex-end', height: 16 , width:64, gap:4, flexDirection:'row', alignItems:'center'}}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: '#FFF', fontSize: 11, textAlign: 'center' }}>모두보기</Text>
                                <Icons name='chevron-forward-outline' color={Color['grey400']} size={12}></Icons>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <Modal transparent={true} visible={modalVisible}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>

                        <Pressable style={{ top: 24 }} onPress={() => setModalVisible(false)}>
                            <View style={{ flexDirection: 'row', height: 64, marginHorizontal: 32, marginTop: 16, justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Icons name='close' color={'#FFF'} size={36} />
                            </View>
                        </Pressable>
                        <View style={{ flex: 1 }} >
                            <FlatList
                                style={{ top: 24, paddingVertical: 4 }}
                                data={banners}
                                renderItem={({ item, index }) => (
                                    <Pressable key={index + 1} style={{ marginHorizontal: 28, height: 160, marginVertical: 8, borderRadius: 5, overflow: 'hidden' }} onPress={(e) => { e.stopPropagation(); navigation.navigate('MyPage'); setModalVisible(false); }}>
                                        <View style={[{ flex: 1, backgroundColor: item.backgroundColor }]}>
                                            <View style={{ position: 'absolute', top: 36, left: 22 }}>
                                                <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: '#FFF', fontSize: 20 }}>{item.Title}</Text>
                                            </View>

                                            <View style={{ position: 'absolute', bottom: 36, left: 22 }}>
                                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 12 }}>{item.Descript}</Text>
                                            </View>
                                        </View>
                                    </Pressable>
                                )} />
                        </View>
                        <View style={{ height: 36 }} />
                    </View>
                </Modal>

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

                        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'NanumSquareNeo-Light',
                                height: 16
                            }}>
                                더 알아보기
                            </Text>
                            <Icons name='chevron-forward-outline' color={Color['grey400']} size={18}></Icons>
                        </Pressable>
                    </View>

                    <ScrollView style={{ height: 126, }} horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ marginLeft: 18 }} />
                            {
                                Array(18).fill(null).map((_, index) => (
                                    <View
                                        key={index}
                                        style={{ height: 126, width: 136, borderColor: Color['grey100'], borderRadius: 10, marginHorizontal: 6, borderWidth: 1 }}
                                    >
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'], fontSize: 14, marginHorizontal: 8, marginTop: 12 }} numberOfLines={2} ellipsizeMode='tail'>인인 활동입니다</Text>
                                        <View style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4, bottom: 32, position: 'absolute' }}>
                                            <View style={{ width: 24, height: 24 }}>
                                                <Icons name='people' color={Color['grey200']} size={24}></Icons>
                                            </View>
                                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], fontSize: 14 }}>{`24`}</Text>
                                        </View>
                                        <View style={{ marginHorizontal: 6, flexDirection: 'row', bottom: 12, position: 'absolute' }}>
                                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], fontSize: 12 }}>{`#술모임`}</Text>
                                            <View style={{ width: 4 }} />
                                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], fontSize: 12 }}>{`#술모임`}</Text>
                                        </View>
                                    </View>
                                ))
                            }
                            <View
                                key={'last'}
                                style={{ height: 126, width: 82, borderRadius: 10, marginHorizontal: 6, justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey400'], fontSize: 16, marginBottom: 8 }}>더보기</Text>
                                <Icons name='arrow-forward-circle' color={Color['grey300']}></Icons>
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
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'NanumSquareNeo-Light',
                                height: 16
                            }}>
                                더 알아보기
                            </Text>
                            <Icons name='chevron-forward-outline' color={Color['grey400']} size={18}></Icons>
                        </Pressable>
                    </View>

                    <ScrollView style={{ height: 208, }} horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <View style={{ marginLeft: 18 }} />
                            {
                                Array(6).fill(null).map((_, index) => (
                                    <View
                                        key={index}
                                        style={{ height: 208, width: 136, borderColor: Color['grey100'], borderRadius: 10, marginHorizontal: 6, overflow: 'hidden', borderWidth: 1 }}
                                    >
                                        <View style={{ height: 148, backgroundColor: Color['blue100'] }} />
                                        <Text style={{ marginHorizontal: 8, marginTop: 8, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey400'], fontSize: 14 }}>산틀-산데렐라</Text>
                                        <View style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4, bottom: 4, position: 'absolute' }}>
                                            <View style={{ width: 20, height: 20 }} >
                                                <Icons name='people' color={Color['red200']} size={20}></Icons>
                                            </View>
                                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: Color['red400'], fontSize: 12 }}>{`24`}</Text>
                                        </View>
                                    </View>
                                ))
                            }

                            <View
                                key={'last'}
                                style={{ height: 208, width: 82, borderRadius: 10, marginHorizontal: 6, justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey400'], fontSize: 16, marginBottom: 8 }}>더보기</Text>
                                <Icons name='arrow-forward-circle' color={Color['grey300']}></Icons>
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
                {isUsed && <View style={{ height: 24 }} />}
            </ScrollView>
            {isUsed && <Animated.View style={{ position: 'absolute', left: 0, right: 0, bottom: animatedValue, height: 196, flex: 1, }}>
                <View style={{ backgroundColor: `rgba(0,0,0,0.8)`, flex: 1, borderRadius: 15, overflow: 'hidden' }}>
                    <Pressable
                        onPress={toggleBottomSheet}>
                        <View style={{ height: 26, width: 40, marginVertical: 4, backgroundColor: '#FFF', alignSelf: 'center' }} />
                    </Pressable>
                    <View style={{ flexDirection: 'row', marginHorizontal: 24, justifyContent: 'space-between' }}>
                        <View style={{ justifyContent: 'center', height: 64 }}>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14 }}>남은 예약 시간</Text>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'], fontSize: 12 }}>(17:00~19:00)</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 110 }}>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14 }}>1 시간</Text>
                            <View style={{ width: 8 }} />
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14 }}>20 분</Text>
                        </View>
                        <Pressable style={{ justifyContent: 'center' }}
                            onPress={debounce(() => navigation.push('CheckOut'), 1000, { leading: true, trailing: false })}>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14, backgroundColor: `rgba(0,0,0,0.4)`, padding: 16, borderRadius: 8, overflow: 'hidden' }}>{`연장/종료`}</Text>
                        </Pressable>
                    </View>
                </View>
            </Animated.View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        gap: 4,
        justifyContent: 'flex-end'
    },
    icons: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
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
        marginHorizontal: 24,
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
    footer: { marginLeft: 24, height: 20, marginTop: 48, marginBottom: 96 }
});

export default HomeScreen;
