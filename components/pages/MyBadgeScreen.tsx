import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { HomeStackParamList } from './pageTypes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Color } from '../../ColorSet';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

type MyBadgeProps = NativeStackScreenProps<HomeStackParamList, 'MyBadges'>;

const BadgeShadow: React.FC = () => {
    return (
        <View style={{ width: 58, height: 20, borderRadius: 10, }}>
            <Svg height="420" width="400" style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}>
                <Defs>
                    <RadialGradient
                        id="grad"
                        cx={32}
                        cy={10}
                        rx={34}
                        ry={12}
                        fx={32}
                        fy={10}
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

const MyBadgeScreen: React.FC<MyBadgeProps> = ({ navigation }) => {
    return (
        <ScrollView contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            backgroundColor: '#fff',
        }}>
            <View style={{ marginVertical: 20, alignItems: 'flex-start', width: '100%' }}>
                <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey800'], left: 32 }}>보유중인 배지</Text>
            </View>
            <View>
                <View style={{ height: 84, width: 288,flexDirection: 'row', justifyContent: 'space-between' ,marginVertical:8,marginBottom:12}}>
                    <View style={{ height: 84, width: 64, flexDirection: 'column' }}>
                        <View style={{ height: 64, width: 64, borderRadius: 100, backgroundColor: Color['grey300'] }} />
                        <BadgeShadow/>
                    </View>
                    <View style={{ height: 84, width: 64, flexDirection: 'column' }}>
                        <View style={{ height: 64, width: 64, borderRadius: 100, backgroundColor: Color['grey300'] }} />
                        <BadgeShadow/>
                    </View>
                    <View style={{ height: 84, width: 64 }}>
                        <View style={{ height: 64, width: 64, borderRadius: 100, backgroundColor: Color['grey300'] }} />
                        <BadgeShadow/>
                    </View>
                </View>
            </View>
            <View style={{ marginVertical: 16, alignItems: 'flex-start', width: '100%' }}>
                <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey800'], left: 32}}>이런 배지도 있어요</Text>
            </View>
        </ScrollView>
    )
}


export default MyBadgeScreen

const styles = StyleSheet.create({

    blurbox: {
        ...StyleSheet.absoluteFillObject,
        width: 64, height: 20, borderRadius: 10,
    }
})