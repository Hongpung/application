import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Color } from '../../ColorSet'
import LongButton from '../../components/buttons/LongButton'
import LottieView from 'lottie-react-native'

import Clab from '@hongpung/assets/lotties/Clab.json';

const CheckOutEndScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => { navigation.setOptions({ animation: 'none' }); }, [])

    useEffect(() => {

        setTimeout(() => setLoading(false), 1000)

    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            {
                isLoading ?
                    <ActivityIndicator style={{ alignSelf: 'center', marginVertical: 24, width: 180, height: 180 }} color={Color['blue500']} size={100} />
                    :
                    <>
                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
                            <Text style={{
                                fontFamily: 'NanumSquareNeo-Bold',
                                fontSize: 22,
                                color: Color['grey700'], textAlign: 'center'
                            }}>{`연습 종료`}</Text>
                            <View style={{
                                width: 400, height: 300, marginVertical: 24, alignSelf: 'center',
                            }}>
                                <LottieView source={Clab} style={{ width: '100%', height: '100%' }} autoPlay speed={1} />
                            </View>
                            <View>
                                <Text style={{
                                    fontFamily: 'NanumSquareNeo-Bold',
                                    fontSize: 22,
                                    color: Color['grey700'], textAlign: 'center'
                                }}>{`연습이 무사히 종료됐어요~\n고생했어요!`}</Text>
                            </View>

                        </View>
                        <View style={{ width: '100%', paddingVertical: 12 }}>
                            <LongButton color='blue' innerText={`종료하기`} isAble={true} onPress={() => { navigation.navigate('Home') }} />
                        </View>
                    </>
            }
        </View>
    )
}

export default CheckOutEndScreen

const styles = StyleSheet.create({})