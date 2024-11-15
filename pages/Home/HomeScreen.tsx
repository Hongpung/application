import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, Modal, FlatList, Animated, NativeSyntheticEvent } from 'react-native';
import { Color } from '@hongpung/ColorSet'
import PagerView from 'react-native-pager-view';
import { debounce } from 'lodash';
import { useAuth } from '@hongpung/hoc/useAuth';
import { Icons } from '@hongpung/components/Icon';
import { useUserReserve } from '@hongpung/hoc/useUserReserve';
import { useRecoilValue } from 'recoil';
import { loginUserState } from '@hongpung/recoil/authState';
import NoticePartition from '@hongpung/components/home/Notice';
import Banner from '@hongpung/components/home/Banner';
import TodaySchedule from '@hongpung/components/home/TodaySchedule';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';
import { useNavigation } from '@react-navigation/native';


type HomeNavProps = NativeStackNavigationProp<MainStackParamList,'Home'>

const HomeScreen: React.FC = () => {

    const navigation = useNavigation<HomeNavProps>()
    const { getUserInfo } = useAuth();
    const loginUser = useRecoilValue(loginUserState);

    const [isUsed, setUsed] = useState(true);
    const [isSlideUp, setSlide] = useState(false);
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


    useEffect(() => {
        const loadUserinfo = async () => {
            await getUserInfo();
        }



        setUsed(false)

        if (!loginUser) {
            loadUserinfo();
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

                <View style={{ marginHorizontal: 24, marginTop: 12 }}>
                    <TodaySchedule />
                </View>

                {/* 배너 부분*/}
                <View style={{ marginHorizontal: 24, marginTop: 20 }}>
                    <Banner />
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

                <View style={{ marginHorizontal: 24, marginTop: 24 }}>
                    <NoticePartition />
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
        height: 120,
        borderRadius: 10,
        overflow: 'hidden'
    },
    footer: { marginLeft: 24, height: 20, marginTop: 48, marginBottom: 96 }
});

export default HomeScreen;
