import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color } from '@hongpung/ColorSet'
import InstrumentCard from '@hongpung/components/cards/InstrumentCard'
import { InstrumentProvider } from '@hongpung/context/InstrumentContext'
import LongButton from '@hongpung/components/buttons/LongButton'
import { Icons } from '@hongpung/components/Icon'
import { CompositeScreenProps } from '@react-navigation/native'
import useFetchUsingToken from '@hongpung/hoc/useFetchUsingToken'
import { ReservationDTO } from '../Reserve/ReserveInterface'
import { User } from '@hongpung/UserType'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MyClubStackStackParamList } from '@hongpung/nav/MyClubStack'
import { MyPageParamList } from '@hongpung/nav/MyPageStack'

interface AttendanceDTO {
    member: User
    attendance: string
}

type PracticeProps =
    CompositeScreenProps<
        NativeStackScreenProps<MyClubStackStackParamList, 'MyClubPracticeInfo'>,
        NativeStackScreenProps<MyPageParamList, 'MyPracticeInfo'>
    >

const PracticeInfoScreen: React.FC<PracticeProps> = ({ route }) => {

    const { reservationId } = route.params;

    const { data: reservationData, loading, error } = useFetchUsingToken<ReservationDTO>(`${process.env.BASE_URL}/reservation/${reservationId}`)
    const { data: attendanceData } = useFetchUsingToken<AttendanceDTO[]>(`${process.env.BASE_URL}/attendance/${reservationId}`)

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <ScrollView contentContainerStyle={{ backgroundColor: '#FFF' }}>
                <View style={{ height: 12 }} />
                <View style={{ marginHorizontal: 24, height: 80, borderWidth: 1, borderRadius: 10, borderColor: Color['grey200'] }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            position: 'absolute', left: 18, top: 16,
                            fontFamily: 'NanumSquareNeo-Bold',
                            fontSize: 18,
                            color: Color['grey700']
                        }}>{reservationData?.message}</Text>
                        <Text style={{
                            position: 'absolute', left: 18, bottom: 12,
                            fontFamily: 'NanumSquareNeo-Light',
                            fontSize: 14,
                            color: Color['grey400']
                        }}>{reservationData?.date} ({daysOfWeek[new Date(reservationData?.date).getDay()]})</Text>

                        <Text style={{
                            position: 'absolute', right: 16, bottom: 12,
                            textAlign: 'right',
                            fontFamily: 'NanumSquareNeo-Light',
                            fontSize: 14,
                            color: Color['grey400']
                        }}>{reservationData?.startTime.slice(0, -3)}~{reservationData?.endTime.slice(0, -3)}</Text>

                        {reservationData?.type == '정규연습' ?
                            <View style={{
                                position: 'absolute', right: 12, top: -4, width: 48, height: 48
                            }} >
                                <Icons name="bookmark-sharp" size={40} color={Color['blue500']} />
                            </View>
                            :
                            <View style={{
                                position: 'absolute', right: 20, top: 12,
                            }}>
                                <Text style={{
                                    textAlign: 'right',
                                    fontFamily: 'NanumSquareNeo-Regular',
                                    fontSize: 14,
                                    color: Color['grey600']
                                }}>{reservationData?.name}</Text>
                                <View style={{ height: 4 }} />
                                {reservationData?.nickname && <Text style={{
                                    textAlign: 'right',
                                    fontFamily: 'NanumSquareNeo-Regular',
                                    fontSize: 12,
                                    color: Color['grey400']
                                }}>{reservationData?.nickname}</Text>}
                            </View>
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
                    }}>{reservationData?.startTime.slice(0, -3)}</Text>
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
                    }}>{reservationData?.endTime.slice(0, -3)}</Text>
                </View>

                <View style={{ height: 12 }} />

                <View style={{ marginHorizontal: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 22 }}>
                    <Text style={{
                        textAlign: 'left',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 14,
                        color: Color['grey400']
                    }}>연장 횟수</Text>
                    <Text style={{
                        textAlign: 'right',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 14,
                        color: Color['grey700']
                    }}>0회</Text>
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
                        }}>{attendanceData?.filter(attendannceData => attendannceData.attendance == '출석').length}</Text>
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
                        }}>{attendanceData?.filter(attendannceData => attendannceData.attendance == '지각').length}</Text>
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'space-between', height: 56, width: 64 }}>
                        <Text style={{
                            fontFamily: 'NanumSquareNeo-Regular',
                            fontSize: 14,
                            color: Color['grey700']
                        }}>결석</Text>
                        <Text style={{
                            fontFamily: 'NanumSquareNeo-Bold',
                            fontSize: 24,
                            color: Color['grey400']
                        }}>{attendanceData?.filter(attendannceData => attendannceData.attendance == '미출석').length}</Text>
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
                    {reservationData?.borrowInstruments && <Text style={{
                        textAlign: 'right',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 14,
                        color: Color['grey300']
                    }}>{'펼쳐서 보기 >'}</Text>}
                </View>

                <View style={{ height: 20 }} />
                <View>
                    {reservationData?.borrowInstruments ?
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            data={reservationData?.borrowInstruments}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{ marginHorizontal: 6 }}>
                                        <InstrumentCard
                                            onSelectInstrument={() => { }}
                                            instrument={item} view={'inBorrow'} />
                                    </View>
                                )
                            }}
                            keyExtractor={item => item.instrumentId + '-key'}
                            horizontal={true}
                            ListHeaderComponent={<View style={{ width: 18 }} />}
                            ListFooterComponent={<View style={{ width: 18 }} />}
                        /> :
                        <View style={{ paddingVertical: 28 }}>
                            <Text style={{
                                textAlign: 'center',
                                fontFamily: 'NanumSquareNeo-Regular',
                                fontSize: 18,
                                color: Color['grey400']
                            }}> 대여한 악기가 없습니다.</Text>
                        </View>}
                </View>
                <View style={{ height: 8 }} />

            </ScrollView>
            <View style={{ paddingVertical: 8, marginHorizontal: 24 }}>
                <LongButton color='green' innerText='이미지로 저장' isAble={true} onPress={() => { }} />
            </View>
        </View>
    )
}

export default PracticeInfoScreen

const styles = StyleSheet.create({})