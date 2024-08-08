import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator, Pressable, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { HomeStackParamList } from './pageTypes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Color } from '../ColorSet';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { BadgeProvider, useBadge, Badge } from './BadgeContext';

type MyBadgeProps = NativeStackScreenProps<HomeStackParamList, 'MyBadges'>;

const BadgeShadow: React.FC<{ width: number, height: number }> = ({ width, height }) => {
    return (
        <View style={{ width: width, height: height, overflow: 'hidden' }}>
            <Svg width={width} height={height} style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}>
                <Defs>
                    <RadialGradient
                        id="grad"
                        cx={width / 2}
                        cy={height / 2}
                        rx={(width + 2) / 2}
                        ry={height / 2 + 2}
                        fx={width / 2}
                        fy={height / 2}
                        gradientUnits="userSpaceOnUse"
                    >
                        <Stop offset="0%" stopColor={Color['grey700']} />
                        <Stop offset="50%" stopColor={Color['grey500']} />
                        <Stop offset="100%" stopColor="#FFFFFF" />
                    </RadialGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad)" />
            </Svg>
        </View>
    )
}

interface BadgeListProps {
    badgeList: Badge[];
}


const BadgeComponent: React.FC<{ badge: Badge }> = ({ badge }) => {
    const [loading, setLoading] = useState(true);

    const { setSelectedBadge, setModalVisible } = useBadge();

    const handleBadgeOnPress = () => {
        setSelectedBadge(badge);
        setModalVisible(true);
    };
    
    return (
        <Pressable onPress={handleBadgeOnPress} style={{ height: 84, width: 72, flexDirection: 'column' }}>
            <View style={{ height: 72, width: 72, borderRadius: 100, overflow: 'hidden' }}>
                {loading && (
                    <View style={{
                        ...StyleSheet.absoluteFillObject,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <ActivityIndicator size="small" color={Color['grey400']} />
                    </View>
                )}
                <Image
                    source={{ uri: badge.imgUrl }}
                    style={{ height: 72, width: 72, }}
                    onLoadEnd={() => setLoading(false)}
                />
            </View>
            <BadgeShadow height={20} width={72} />
        </Pressable>
    )
}

const BadgeList: React.FC<BadgeListProps> = ({ badgeList }) => {
    const renderBadges = () => {
        const rows = [];
        for (let i = 0; i < badgeList.length; i += 3) {
            const group = badgeList.slice(i, i + 3);
            rows.push(
                <View key={i} style={{ height: 84, width: 288, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, }}>
                    {group.map((badge, index) => (
                        <BadgeComponent key={index} badge={badge} />
                    ))}
                    {group.length % 3 == 2 && <View style={{ height: 84, width: 72 }} />}
                </View>
            );
        }
        return rows;
    };
    return (
        <View>
            {renderBadges()}
        </View>
    )
}

const MyBadgeScreen: React.FC<MyBadgeProps> = ({ navigation }) => {

    const haveBadge = [{
        name: "그냥 배지",
        imgUrl: 'https://storep-phinf.pstatic.net/ogq_61d824396f503/original_11.gif?type=pa50_50',
        descript: "그냥 랜덤 배지",
        isHave: true
    },
    {
        name: "테스트 배지",
        imgUrl: 'https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/042/307/533/42307533_1683708946356_31_600x600.JPG',
        descript: "그냥 테스트 배지",
        isHave: true
    },
    ]
    const etcBadge = [{
        name: "너는 못 가질 배지",
        imgUrl: 'https://dimg.donga.com/wps/SPORTS/IMAGE/2021/10/30/109989730.1.jpg',
        descript: "아마도 그대로 활동해도 너는 못가질거야\n 이 배지는 특별하거든",
        isHave: false
    },
    {
        name: "테스트 배지",
        imgUrl: 'https://postfiles.pstatic.net/MjAyNDA3MDdfMjQy/MDAxNzIwMzYwODg3Mzg3.siw5LvdkA7a4MPbS07jHAIFKw7GzlIdHbvJ4qvMeoJog.fiYaRMvdmmfUe56jgp-hQ8C5kWM20zJB1kLzAEQXakIg.JPEG/KakaoTalk_20240707_225628831_01.jpg?type=w386',
        descript: "윤하 공연 다녀오면 받을 수 있었답니다 호호",
        isHave: false
    },
    {
        name: "윤하 배지",
        imgUrl: 'https://postfiles.pstatic.net/MjAyNDA2MjdfMzcg/MDAxNzE5NDE0MDM3NDUz.RuBIBrXGaRILULX7ZRzJmgKk1FS7GcWcWkHZ34OGlyUg.PmuZCGZpK_0vOvcOvPi17JCOW6YyxkV882nHJl0crsYg.JPEG/KakaoTalk_20240626_234559509_06.jpg?type=w386',
        descript: "윤하 기요워",
        isHave: false
    }, {
        name: "데뷔 배지",
        imgUrl: 'https://img.khan.co.kr/news/2023/04/18/l_2023041901000727200065392.jpg',
        descript: "윤하는 1988년 4월 29일 생으로 영문 표기는 YounHa이다.\n일본에서 2005년도 유비키리(약속)으로 데뷔하여 지금 데뷔 20주년이다.",
        isHave: false
    },
    ]

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <BadgeProvider>
            <View style={{
                flexGrow: 1,
                backgroundColor: '#fff',
            }}>
                <ScrollView contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: 'center',
                    backgroundColor: '#fff',
                }}>
                    {haveBadge && <View style={{ marginVertical: 20, alignItems: 'flex-start', width: '100%' }}>
                        <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey800'], left: 32 }}>보유중인 배지</Text>
                    </View>}
                    {haveBadge && <BadgeList badgeList={haveBadge} />}
                    {etcBadge && <View style={{ marginVertical: 16, alignItems: 'flex-start', width: '100%' }}>
                        <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey800'], left: 32 }}>이런 배지도 있어요</Text>
                    </View>}
                    {etcBadge && <BadgeList badgeList={etcBadge} />}
                </ScrollView>
            </View>
            <BadgeModal />
        </BadgeProvider>
    )
}

const BadgeModal: React.FC = () => {
    const { selectedBadge, modalVisible, setModalVisible } = useBadge();
    const [loading, setLoading] = useState(true);

    return (
        <Modal transparent={true} visible={modalVisible}>
            <Pressable style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
                onPress={() => setModalVisible(false)}
            >
                <Pressable style={{ width: 340, height: 200, backgroundColor: '#FFF', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }} onPress={(e) => e.stopPropagation()}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <View style={{ height: 122, width: 96, flexDirection: 'column', }}>
                            <View style={{ height: 96, width: 96, borderRadius: 100, overflow: 'hidden' }}>
                                {loading && (
                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <ActivityIndicator size="small" color={Color['grey400']} />
                                    </View>
                                )}
                                <Image
                                    source={{ uri: selectedBadge?.imgUrl }}
                                    style={{ height: 96, width: 96, }}
                                    onLoadEnd={() => setLoading(false)}
                                />
                            </View>
                            <BadgeShadow
                                height={30} width={96} />
                        </View>
                        <View style={{ marginLeft: 20, height: 112 }}>
                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-ExtraBold', color: Color['grey800'], marginBottom: 12 }}>{selectedBadge?.name}</Text>
                            <Text numberOfLines={3} ellipsizeMode="tail" style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], width: 180, height: 84, flexWrap: 'wrap' }}>{selectedBadge?.descript}</Text>
                        </View>
                    </View>

                    <Pressable
                        style={{
                            position: 'absolute',
                            top: 6, right: 2, width: 36, height: 36, justifyContent: 'center', alignItems: 'center'
                        }}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={{ color: Color['grey700'], textAlign: 'center' }}>X</Text>
                    </Pressable>
                    {selectedBadge?.isHave && <TouchableOpacity
                        style={{
                            position: 'absolute',
                            bottom: 20, right: 16, width: 72, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: Color['grey100']
                        }}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Bold', color: Color['blue400'], textAlign: 'center' }}>적용</Text>
                    </TouchableOpacity>}
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default MyBadgeScreen

const styles = StyleSheet.create({

    blurbox: {
        ...StyleSheet.absoluteFillObject,
        width: 64, height: 20, borderRadius: 10,
    }
})