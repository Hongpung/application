import { NativeSyntheticEvent, StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Color } from '@hongpung/ColorSet';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';



type BannerNavParams = NativeStackNavigationProp<MainStackParamList, 'Home'>


const BlankBanner: React.FC = () => {
    return (
        <View style={{ flex: 1, backgroundColor: Color['red300'] }}>
            <View style={{ position: 'absolute', top: 30, left: 22 }}>
                <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: '#FFF', fontSize: 20 }}>아직 등록된 배너가 없어요</Text>
            </View>
            <View style={{ position: 'absolute', bottom: 30, left: 22 }}>
                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 12 }}>
                    {`의장에게 배너 등록을 요청할 수 있어요!\n별도의 비용은 없습니다.`}
                </Text>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    bannerContainer: {
        height: 120,
        borderRadius: 10,
        overflow: 'hidden'
    }
})