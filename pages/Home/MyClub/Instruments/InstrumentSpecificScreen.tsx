import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator, Modal, Pressable, Dimensions, Alert } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';

import { Color } from '@hongpung/ColorSet';
import { Instrument } from '@hongpung/UserType';
import useFetchUsingToken from '@hongpung/src/common/hooks/useFetchUsingToken';
import Header from '@hongpung/components/common/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClubInstrumentStackParamList } from '@hongpung/nav/InstrumentStack';
import { useRecoilValue } from 'recoil';
import { loginUserState } from '@hongpung/recoil/authState';


const { width } = Dimensions.get('window');

type InstrumentSpecificProps = NativeStackScreenProps<ClubInstrumentStackParamList, 'InstrumentSpecific'>

const InstrumentSpecificScreen: React.FC<InstrumentSpecificProps> = ({ navigation, route }) => {

    const { instrumentId } = route?.params;

    const [imageModalVsible, setImageModalVsible] = useState(false);
    const [aspectRatio, setAspectRatio] = useState<number | null>(null);
    const loginUser = useRecoilValue(loginUserState)
    const isFocusing = useIsFocused();
    const { data, loading, error } = useFetchUsingToken<Instrument>(
        `${process.env.EXPO_PUBLIC_BASE_URL}/instrument/${instrumentId}`
        , {}, 5000, [instrumentId, isFocusing]
    )

    console.log(loginUser?.role.length, loginUser?.club, data, loading)

    useEffect(() => {
        if (!!data?.imageUrl) {
            Image.getSize(data.imageUrl!, (width, height) => {
                setAspectRatio(width / height);
            }, (error) => {
                console.error(`Couldn't get the image size: ${error.message}`);
            });
        }
    }, [data])

    if (loading)
        return (
            <View style={{ flex: 1, backgroundColor: `#FFF`, justifyContent: 'center' }}>
                <ActivityIndicator size={'large'} color={Color['blue500']} />
            </View>
        )

    if (error) {
        Alert.alert('오류', '악기 정보를 찾을 수 없습니다.')
        navigation.goBack();
        return (<View><Text>오류:악기 정보를 찾을 수 없습니다.</Text></View>)
    }

    if (data == null) {
        return (
            <View style={{ flex: 1, backgroundColor: `#FFF`, justifyContent: 'center' }}>
                <ActivityIndicator size={'large'} color={Color['blue500']} />
            </View>)
    }

    return (
        <View style={{ flex: 1, backgroundColor: `#FFF` }}>

            <Modal visible={imageModalVsible} transparent={true}>
                <Pressable onPress={() => setImageModalVsible(false)}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    {data.imageUrl ?
                        <Image
                            source={{ uri: data.imageUrl }}
                            style={[styles.image, { width: width - 36, height: (width - 36) / aspectRatio!, borderRadius: 15 }]}
                        />
                        :
                        <View style={[styles.image, { backgroundColor: Color['grey200'] }]} />
                    }
                </Pressable>
            </Modal>
            {loginUser?.club == data.club && loginUser?.role.length != 0 ?
                <Header
                    leftButton='close'
                    HeaderName='악기 상세'
                    RightButton={'수정'}
                    RightAction={() => navigation.push('InstrumentEdit', { instrumentInform: JSON.stringify(data) })}
                />
                :
                <Header
                    leftButton='close'
                    HeaderName='악기 상세'
                />
            }
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <View style={{ height: 12 }} />
                <Pressable style={styles.imageContainer}
                    onPress={() => {
                        data.imageUrl && setImageModalVsible(true)
                    }}>
                    {data.imageUrl ?
                        <Image
                            source={{ uri: data.imageUrl }}
                            style={styles.image}
                        />
                        :
                        <View
                            style={[styles.image, { backgroundColor: Color['grey200'] }]}
                        />
                    }
                </Pressable>

                <View style={{ flexDirection: 'column', gap: 12, paddingVertical: 24 }}>
                    <View style={styles.Row}>

                        <Text style={styles.RowLeft}>{`악기 이름`}</Text>
                        <Text style={styles.RowRight}>{data.name}</Text>

                    </View>

                    <View style={styles.Row}>

                        <Text style={styles.RowLeft}>{`악기 타입`}</Text>
                        <Text style={styles.RowRight}>{data.instrumentType}</Text>

                    </View>

                    <View style={[styles.Row]}>
                        <Text style={styles.RowLeft}>{`대여 상태`}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{ fontFamily: "NanumSquareNeo-Bold", fontSize: 16, color: data.borrowAvailable ? Color['blue400'] : Color['red400'] }}>{data.borrowAvailable ? '대여 가능' : '대여 불가'}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 20 }} />

                <View style={{ alignSelf: 'flex-start', paddingHorizontal: 28 }}>
                    <View>
                        <Text style={{ fontSize: 18, fontFamily: "NanumSquareNeo-Bold", }}>대여 내역</Text>
                    </View>
                </View>
                <View style={{ paddingVertical: 6 }}>
                    {data!.borrowHistory.length > 0 ?

                        data!.borrowHistory.map(borrowHistory =>
                        (<View
                            key={borrowHistory.borrowerName + borrowHistory.borrowDate}
                            style={{ width: 320, height: 76, borderRadius: 5, borderWidth: 1, borderColor: Color['grey200'], marginVertical: 6 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', position: 'absolute', left: 14, top: 12 }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontFamily: "NanumSquareNeo-Regular",
                                    color: Color['grey700'],
                                    marginRight: 2
                                }}>{borrowHistory.borrowerName}</Text>
                                {borrowHistory?.borrowerNickname && <Text style={{
                                    fontSize: 14,
                                    fontFamily: "NanumSquareNeo-Regular",
                                    color: Color['grey400']
                                }}>{borrowHistory.borrowerNickname}</Text>}
                            </View>
                            <View style={{ position: 'absolute', left: 14, bottom: 12 }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontFamily: "NanumSquareNeo-Regular",
                                    color: Color['grey400']
                                }}>{borrowHistory.borrowerName}</Text>
                            </View>
                            <View style={{ position: 'absolute', right: 12, bottom: 12 }}>
                                <Text style={{
                                    textAlign: 'right',
                                    fontSize: 14,
                                    fontFamily: "NanumSquareNeo-Regular",
                                    color: Color['grey400']
                                }}>{borrowHistory.borrowDate}</Text>
                            </View>
                        </View>))

                        :

                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingVertical: 32 }}>
                            <Text style={{
                                textAlign: 'right',
                                fontSize: 17,
                                fontFamily: "NanumSquareNeo-Regular",
                                color: Color['grey400']
                            }}>대여 내역이 없습니다...</Text>
                        </View>
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default InstrumentSpecificScreen

const styles = StyleSheet.create({
    card: {
        width: 154,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Color['grey200'],
    },
    imageContainer: {
        overflow: 'hidden',
        width: 308,
        height: 204,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 308,
        height: 204,
    },
    Row: {
        flexDirection: 'row',
        height: 40,
        width: 342,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12
    },
    RowLeft: {
        fontFamily: "NanumSquareNeo-Regular",
        fontSize: 16,
        color: Color['grey400']
    },
    RowRight: {
        fontFamily: "NanumSquareNeo-Regular",
        fontSize: 16,
        color: Color['grey700']
    }
})

