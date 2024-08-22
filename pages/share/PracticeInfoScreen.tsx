import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color } from '../../ColorSet'
import InstrumentCard from '../../components/cards/InstrumentCard'
import { InstrumentProvider } from '../Home/MyClub/Instruments/context/InstrumentContext'
import LongButton from '../../components/buttons/LongButton'

const PracticeInfoScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#FFF', alignItems: 'center' }}>
            <ScrollView contentContainerStyle={{ backgroundColor: '#FFF' }}>
                <View style={{ height: 12 }} />
                <View style={{ marginHorizontal: 24, height: 80, borderWidth: 1, borderRadius: 10, borderColor: Color['grey200'] }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            position: 'absolute', left: 18, top: 16,
                            fontFamily: 'NanumSquareNeo-Bold',
                            fontSize: 18,
                            color: Color['grey700']
                        }}>나는 바보</Text>
                        <Text style={{
                            position: 'absolute', left: 18, bottom: 12,
                            fontFamily: 'NanumSquareNeo-Light',
                            fontSize: 14,
                            color: Color['grey400']
                        }}>{`2024-07-18(월)`}</Text>

                        <Text style={{
                            position: 'absolute', right: 16, bottom: 12,
                            textAlign: 'right',
                            fontFamily: 'NanumSquareNeo-Light',
                            fontSize: 14,
                            color: Color['grey400']
                        }}>{`17:00~18:00`}</Text>

                        {/* 동아리 개별 연습 유형 */
                            // <View style={{
                            //     position: 'absolute', right: 20, top: 12,
                            // }}>
                            //     <Text style={{
                            //         textAlign: 'right',
                            //         fontFamily: 'NanumSquareNeo-Regular',
                            //         fontSize: 14,
                            //         color: Color['grey600']
                            //     }}>홍길동</Text>
                            //     <View style={{ height: 4 }} />
                            //     <Text style={{
                            //         textAlign: 'right',
                            //         fontFamily: 'NanumSquareNeo-Regular',
                            //         fontSize: 12,
                            //         color: Color['grey400']
                            //     }}>홍길동</Text>
                            // </View>
                        }
                        {/* 동아리 정기 연습 유형 */
                            < View style={{
                                position: 'absolute', right: 24, top: -1, width: 26, height: 36, backgroundColor: Color['blue500']
                            }} />
                        }
                    </View>
                </View>

                <View style={{ height: 24 }} />

                <Text style={{
                    marginHorizontal: 28,
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 18,
                    color: Color['grey700']
                }}>연습 시간</Text>

                <View style={{ height: 20 }} />

                <View style={{ marginHorizontal: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 22 }}>
                    <Text style={{
                        textAlign: 'left',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 14,
                        color: Color['grey400']
                    }}>시작 시간</Text>
                    <Text style={{
                        textAlign: 'right',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 14,
                        color: Color['grey700']
                    }}>17:00</Text>
                </View>

                <View style={{ height: 12 }} />

                <View style={{ marginHorizontal: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 22 }}>
                    <Text style={{
                        textAlign: 'left',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 14,
                        color: Color['grey400']
                    }}>종료 시간</Text>
                    <Text style={{
                        textAlign: 'right',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 14,
                        color: Color['grey700']
                    }}>17:00</Text>
                </View>

                <View style={{ height: 12 }} />

                <View style={{ marginHorizontal: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 22 }}>
                    <Text style={{
                        textAlign: 'left',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 14,
                        color: Color['grey400']
                    }}>시작 시간</Text>
                    <Text style={{
                        textAlign: 'right',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 14,
                        color: Color['grey700']
                    }}>17:00</Text>
                </View>

                <View style={{ height: 32 }} />

                <View style={{ marginHorizontal: 28, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 22 }}>
                    <Text style={{
                        textAlign: 'left',
                        fontFamily: 'NanumSquareNeo-Bold',
                        fontSize: 18,
                        color: Color['grey700']
                    }}>출석 확인</Text>
                    <Text style={{
                        textAlign: 'right',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 14,
                        color: Color['grey300']
                    }}>{'전체 보기 >'}</Text>
                </View>

                <View style={{ height: 20 }} />

                <View style={{ marginHorizontal: 36, paddingVertical: 22, borderRadius: 15, backgroundColor: Color['grey100'], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'space-between', height: 56, width: 64 }}>
                        <Text style={{
                            fontFamily: 'NanumSquareNeo-Regular',
                            fontSize: 14,
                            color: Color['grey700']
                        }}>출석</Text>
                        <Text style={{
                            fontFamily: 'NanumSquareNeo-Bold',
                            fontSize: 24,
                            color: Color['blue500']
                        }}>26</Text>
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'space-between', height: 56, width: 64 }}>
                        <Text style={{
                            fontFamily: 'NanumSquareNeo-Regular',
                            fontSize: 14,
                            color: Color['grey700']
                        }}>지각</Text>
                        <Text style={{
                            fontFamily: 'NanumSquareNeo-Bold',
                            fontSize: 24,
                            color: Color['red500']
                        }}>2</Text>
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'space-between', height: 56, width: 64 }}>
                        <Text style={{
                            fontFamily: 'NanumSquareNeo-Regular',
                            fontSize: 14,
                            color: Color['grey700']
                        }}>출석</Text>
                        <Text style={{
                            fontFamily: 'NanumSquareNeo-Bold',
                            fontSize: 24,
                            color: Color['grey400']
                        }}>-</Text>
                    </View>
                </View>

                <View style={{ height: 32 }} />

                <View style={{ marginHorizontal: 28, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 22 }}>
                    <Text style={{
                        textAlign: 'left',
                        fontFamily: 'NanumSquareNeo-Bold',
                        fontSize: 18,
                        color: Color['grey700']
                    }}>대여 악기</Text>
                    <Text style={{
                        textAlign: 'right',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 14,
                        color: Color['grey300']
                    }}>{'펼쳐서 보기 >'}</Text>
                </View>

                <View style={{ height: 20 }} />
                <View>
                    <InstrumentProvider>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            data={[`data1`, `data2`, `data3`]}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{ marginHorizontal: 6 }}>
                                        <InstrumentCard instrument={{
                                            imgURL: null,
                                            club: '들녘',
                                            type: '쇠',
                                            name: 'www',
                                            state: '대여가능',
                                            nickname:'ss'
                                        }} view={'inBorrow'} />
                                    </View>
                                )
                            }}
                            keyExtractor={item => item + 'kk'}
                            horizontal={true}
                            ListHeaderComponent={<View style={{ width: 18 }} />}
                            ListFooterComponent={<View style={{ width: 18 }} />}
                        />
                    </InstrumentProvider>
                </View>
                <View style={{ height: 32 }} />

                <View style={{ marginHorizontal: 28, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 22 }}>
                    <Text style={{
                        textAlign: 'left',
                        fontFamily: 'NanumSquareNeo-Bold',
                        fontSize: 18,
                        color: Color['grey700']
                    }}
                    >연습 정리 사진</Text>
                    <Text style={{
                        textAlign: 'right',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 14,
                        color: Color['grey300']
                    }}>{'펼쳐서 보기 >'}</Text>
                </View>

                <View style={{ height: 20 }} />

                <View>
                    <InstrumentProvider>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            data={[`data1`, `data2`, `data3`]}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{ marginHorizontal: 6 }}>
                                        <View style={{ height: 124, width: 156, backgroundColor: Color['grey200'], borderRadius: 10 }} />
                                    </View>
                                )
                            }}
                            keyExtractor={item => item + 'kk'}
                            horizontal={true}
                            ListHeaderComponent={<View style={{ width: 18 }} />}
                            ListFooterComponent={<View style={{ width: 18 }} />}
                        />
                    </InstrumentProvider>
                </View>

                <View style={{ height: 8 }} />

            </ScrollView>
            <View style={{paddingVertical:8}}>
                <LongButton color='green' innerText='이미지로 저장' isAble={true} onPress={() => { }} />
            </View>
        </View>
    )
}

export default PracticeInfoScreen

const styles = StyleSheet.create({})