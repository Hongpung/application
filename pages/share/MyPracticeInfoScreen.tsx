import { FlatList, ScrollView, StyleSheet, Text, View, Image, Modal, Pressable, Dimensions, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { Color } from '@hongpung/ColorSet'


import LongButton from '@hongpung/components/buttons/LongButton'
import { Icons } from '@hongpung/components/common/Icon'

import { User } from '@hongpung/UserType'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { MyPageParamList } from '@hongpung/nav/MyPageStack'
import { AttendanceStatus, Session } from '../Home/MyPage/MyPractices/MyPracticesScreen'


import useFetchUsingToken from '@hongpung/hoc/useFetchUsingToken'

const { width, height } = Dimensions.get('window')

type PracticeProps = NativeStackScreenProps<MyPageParamList, 'MyPracticeInfo'>

const MyPracticeInfoScreen: React.FC<PracticeProps> = ({ route }) => {

    const { sessionId } = route.params;
    const aspectRatio = 3 / 4;
    const [selectedImage, selectImage] = useState<string | null>(null)
    const [modalState, setModalState] = useState<'Images' | 'AttendanceList' | 'None'>('None')
    const { data, loading, error } = useFetchUsingToken<Session>(`${process.env.BASE_URL}/session-log/specific/${sessionId}`)

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    console.log(data)
    if (!data) return (
        <View>

        </View>
    )
    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Modal visible={modalState == 'Images' && !!selectedImage} transparent={true}>
                <Pressable onPress={() => { selectImage(null); setModalState('None') }}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    {selectedImage &&
                        <Image
                            source={{ uri: selectedImage }}
                            style={[{ width: width - 36, height: (width - 36) / aspectRatio!, borderRadius: 15 }]}
                        />
                    }
                </Pressable>
            </Modal>
            <AttendanceModal attendanceList={data.attendanceList} visible={modalState == 'AttendanceList'} onClose={() => setModalState('None')} />
            <ScrollView contentContainerStyle={{ backgroundColor: '#FFF' }}>
                <View style={{ height: 12 }} />
                <View style={{ marginHorizontal: 24, height: 80, borderWidth: 1, borderRadius: 10, borderColor: Color['grey200'] }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            position: 'absolute', left: 18, top: 16,
                            fontFamily: 'NanumSquareNeo-Bold',
                            fontSize: 18,
                            color: Color['grey700']
                        }}>{data?.title}</Text>
                        <Text style={{
                            position: 'absolute', left: 18, bottom: 12,
                            fontFamily: 'NanumSquareNeo-Light',
                            fontSize: 14,
                            color: Color['grey400']
                        }}>{data?.date} ({daysOfWeek[new Date(data.date).getDay()]})</Text>

                        <Text style={{
                            position: 'absolute', right: 16, bottom: 12,
                            textAlign: 'right',
                            fontFamily: 'NanumSquareNeo-Light',
                            fontSize: 14,
                            color: Color['grey400']
                        }}>{data?.startTime}~{data?.endTime}</Text>

                        {data?.reservationType == 'REGULAR' ?
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
                                }}>{data?.creatorName}</Text>
                                <View style={{ height: 4 }} />
                                {data?.creatorNickname && <Text style={{
                                    textAlign: 'right',
                                    fontFamily: 'NanumSquareNeo-Regular',
                                    fontSize: 12,
                                    color: Color['grey400']
                                }}>{data?.creatorNickname}</Text>}
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
                    }}>{data?.startTime}</Text>
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
                    }}>{data?.endTime}</Text>
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
                    }}>{data.extendCount}회</Text>
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
                    }}
                        onPress={() => setModalState('AttendanceList')}
                    >{'전체 보기 >'}</Text>
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
                        }}>{data?.attendanceList.filter(attendannceData => attendannceData.status == '출석' || attendannceData.status == '참가').length}</Text>
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
                        }}>{data?.attendanceList.filter(attendannceData => attendannceData.status == '지각').length}</Text>
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
                        }}>{data?.attendanceList.filter(attendannceData => attendannceData.status == '결석').length}</Text>
                    </View>
                </View>

                <View style={{ height: 32 }} />

                <View style={{ marginHorizontal: 28, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 22 }}>
                    <Text style={{
                        textAlign: 'left',
                        fontFamily: 'NanumSquareNeo-Bold',
                        fontSize: 18,
                        color: Color['grey700']
                    }}>종료 사진</Text>
                    {data?.returnImageUrl && <Text style={{
                        textAlign: 'right',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 14,
                        color: Color['grey300']
                    }}>{'펼쳐서 보기 >'}</Text>}
                </View>

                <View style={{ height: 20 }} />
                <View>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={data?.returnImageUrl}
                        renderItem={({ item }) => {
                            return (
                                <Pressable style={{
                                    width: 120, // 부모 뷰의 너비에 맞춤
                                    height: 160, // 부모 뷰의 너비에 맞춤
                                    borderRadius: 15,
                                    borderWidth: 0.5,
                                    borderColor: Color['grey200'],
                                    overflow: 'hidden'
                                }}
                                    onPress={() => { selectImage(item); setModalState('Images'); }}>
                                    <Image
                                        source={{ uri: item }}
                                        style={{
                                            width: '100%', // 부모 뷰의 너비를 채움
                                            height: '100%', // 부모 뷰의 높이를 채움
                                            resizeMode: 'cover', // 원본 비율 유지
                                        }}
                                    />
                                </Pressable>

                            )
                        }}
                        ItemSeparatorComponent={() => (<View style={{ width: 12 }} />)}
                        keyExtractor={(item, index) => 'image' + index + '-key'}
                        horizontal={true}
                        ListHeaderComponent={<View style={{ width: 18 }} />}
                        ListFooterComponent={<View style={{ width: 18 }} />}
                    />
                </View>
                <View style={{ height: 8 }} />

            </ScrollView>
        </View>
    )
}



const AttendanceModal: React.FC<{ attendanceList: AttendanceStatus[], visible: boolean, onClose: () => void }> = ({ attendanceList, visible, onClose }) => {

    return (
        <Modal visible={visible} transparent={true}>
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                        <Pressable
                            style={{
                                height: 360,
                                width: '100%',
                                marginHorizontal: 24,
                                paddingVertical: 16,
                                paddingHorizontal: 12,
                                borderRadius: 25,
                                backgroundColor: 'white',
                            }}
                            onPress={(e) => e.stopPropagation()}
                        >
                            <FlatList
                                data={[...attendanceList]}
                                contentContainerStyle={{ flexDirection: 'column', gap: 24 }}
                                alwaysBounceVertical={false}
                                renderItem={({ item: { member, status } }) => (
                                    <View style={{ marginHorizontal:8, backgroundColor:'#DDDDDD', paddingVertical:24, paddingHorizontal:8 }}>
                                        <Text>
                                            {member.name}{status}
                                        </Text>
                                    </View>
                                )}
                                keyboardShouldPersistTaps="handled"
                            />
                        </Pressable>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>

    )

}

export default MyPracticeInfoScreen