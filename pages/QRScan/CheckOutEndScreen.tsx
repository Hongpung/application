import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Color } from '../../ColorSet'
import LongButton from '../../components/buttons/LongButton'

const CheckOutEndScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => { navigation.setOptions({ animation: 'none' }); }, [])

    useEffect(() => {

        setTimeout(() => setLoading(false), 1000)

    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ height: '20%' }}></View>
            {isLoading ? <ActivityIndicator style={{ alignSelf: 'center', marginVertical: 24, width: 180, height: 180 }} color={Color['blue500']} size={100}></ActivityIndicator> :
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontFamily: 'NanumSquareNeo-Bold',
                        fontSize: 22,
                        color: Color['grey700'], textAlign: 'center'
                    }}>{`연습 종료`}</Text>
                    <View style={{
                        width: 180, height: 180, borderRadius: 5, borderWidth: 1, borderColor: Color['blue500'], marginVertical: 24, overflow: 'hidden', alignSelf: 'center', backgroundColor: Color['blue200']
                    }}></View>
                    <View>
                        <Text style={{
                            fontFamily: 'NanumSquareNeo-Bold',
                            fontSize: 22,
                            color: Color['grey700'], textAlign: 'center'
                        }}>{`연습이 무사히 종료됐어요~\n고생했어요!`}</Text>
                    </View>

                    <View style={{ position: 'absolute', width: '100%', bottom: 16 }}>
                        <LongButton color='blue' innerText={`종료하기`} isAble={true} onPress={() => { navigation.navigate('Home') }} />
                    </View>
                </View>}
        </View>
    )
}

export default CheckOutEndScreen

const styles = StyleSheet.create({})