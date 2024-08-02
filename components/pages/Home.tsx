import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Color } from '../../ColorSet';
import PagerView from 'react-native-pager-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from './pageTypes';

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, "Home">;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

    const [bannerNum, setBannerNum] = useState(0);
    const pagerRef = useRef<PagerView>(null);//러페런스 추가


    const pages = [
        { backgroundColor: Color.green200, text: '사진 1' },
        { backgroundColor: Color.blue200, text: '사진 2' },
        { backgroundColor: Color.red200, text: '사진 3' },
    ];
    const bannerMass = pages.length;


    return (
        <ScrollView style={styles.container}>
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
            <View style={styles.textRow}>
                <Text style={styles.dateText}>2024년 7월 7일</Text>
                <Text style={styles.greetingText}>홍길동님 안녕하세요</Text>
            </View>
            <View>
                <Text style={styles.ScheduleOfDate}>
                    오늘의 일정이 없어요
                </Text>
            </View>
            <View style={styles.Advertisebanner}>
                {/* 배너 확인 */}
                <View style={{
                    flex: 1,
                }}>
                    <PagerView style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} initialPage={0}
                        onPageScroll={(e) => { const { position, offset } = e.nativeEvent; setBannerNum(position) }}
                        ref={pagerRef}>
                        {pages.map((page, index) => (
                            <View key={index} style={{ flex: 1 }}>
                                <View style={[{ flex: 1, backgroundColor: page.backgroundColor }]}>
                                </View>
                            </View>
                        ))}
                    </PagerView>
                </View>
                <View style={{ position: 'absolute', backgroundColor: Color['grey600'], bottom: 8, right: 8, borderRadius: 50, flexDirection: 'row', alignItems: 'center', width: 88, height: 20, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 76, height: 16 }}>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: '#FFF', fontSize: 9, textAlignVertical: 'center' }}>{bannerNum + 1}/{bannerMass}</Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: '#FFF', fontSize: 10, height: 12 }}>모두보기 +</Text>
                    </View>
                </View>
            </View>
            <View style={{ marginHorizontal: 24, marginTop: 32, }}>
                <Text style={{
                    fontSize: 18,
                    fontFamily: 'NanumSquareNeo-Bold',
                    marginBottom: 12,
                    marginHorizontal: 4
                }}>
                    우리 동아리
                </Text>
                <TouchableOpacity activeOpacity={0.85}>
                    <View style={{ height: 120, backgroundColor: Color['grey300'], borderRadius: 10 }} />
                </TouchableOpacity>
            </View>
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
            <View style={{ marginLeft: 24, height: 120, marginTop: 48, marginBottom: 96 }}>
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
        borderWidth: 2,
        borderRadius: 10,
        marginTop: 12
    },
    Advertisebanner: {
        marginTop: 28,
        marginHorizontal: 24,
        height: 150,
        borderRadius: 10,
        overflow: 'hidden'
    }
});

export default HomeScreen;
