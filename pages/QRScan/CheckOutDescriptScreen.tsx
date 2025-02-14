import { StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import LongButton from '@hongpung/src/common/components/buttons/LongButton';
import { Color } from '@hongpung/ColorSet';
import PagerView from 'react-native-pager-view';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CheckOutStackParamList } from '@hongpung/nav/HomeStacks';
import { useNavigation } from '@react-navigation/native';
import { useRecoilValue } from 'recoil';
import { onUseSession } from '@hongpung/recoil/sessionState';
import LottieView from 'lottie-react-native';
import Dehumidifier from '@hongpung/assets/lotties/Dehumidifier.json'
import Trash from '@hongpung/assets/lotties/Trash.json';
import { useCheckOut } from './context/useCheckOutContext';


type PictureCheckNavProp = NativeStackNavigationProp<CheckOutStackParamList, 'PictureCheck'>

const CheckOutDescriptScreen: React.FC = () => {

    const navigation = useNavigation<PictureCheckNavProp>();
    const { usingSession, setStep } = useCheckOut();
    const [pageNum, setPageNum] = useState(0);
    const Pages = ["0", "1", "2"]
    const photo = 'phptoUrl'//나중에 추가할것
    const pagerRef = useRef<PagerView>(null);//러페런스 추가

    // 페이지 이동 함수
    const goToPage = () => {
        if (pagerRef.current) {
            pagerRef.current.setPage(pageNum + 1);
        }
    };

    if (!usingSession)
        return null;

    if (
        usingSession.borrowInstruments && usingSession.borrowInstruments.length > 0
    )
        return (
            // 배경용
            <View style={styles.basicBackground}>
                <View style={{ flex: 1, flexDirection: 'column', display: 'flex', justifyContent: 'center', gap: 24, paddingTop: 160 }}>

                    <Text style={{
                        textAlign: 'center',
                        fontFamily: "NanumSquareNeo-Bold",
                        fontSize: 20,
                    }}>연습실 정리 안내</Text>
                    <PagerView
                        style={{
                            flex: 1,
                            alignItems: 'center'
                        }}
                        initialPage={0}
                        onPageScroll={(e) => {
                            const { position, offset } = e.nativeEvent;
                            setPageNum(position);
                        }}
                        ref={pagerRef}>

                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                        }}
                            key={Pages[0]}>
                            <View style={[styles.CheckOutPicture,]}>
                                <LottieView source={require('@hongpung/assets/lotties/Instrument.json')} style={{ width: '100%', height: '100%' }} autoPlay speed={1} />
                            </View>
                            <Text style={styles.CheckOutDescript}>
                                {`사용한 ${usingSession?.borrowInstruments}개의 악기들을\n제자리에 돌려놓고 찍어주세요`}
                            </Text>
                        </View>
                        <View style={{
                            alignItems: 'center',
                        }}
                            key={Pages[1]}>
                            <View style={[styles.CheckOutPicture,]}>
                                <LottieView source={Trash} style={{ width: '100%', height: '100%' }} autoPlay speed={1.6} />
                            </View>
                            <Text style={styles.CheckOutDescript}>
                                {`바닥을 정리하고 섭취한 음료들을\n버리고 연습실을 찍어주세요`}
                            </Text>
                        </View>
                        <View style={{
                            alignItems: 'center',
                        }}
                            key={Pages[2]}>
                            <View style={[styles.CheckOutPicture]}>
                                <LottieView source={Dehumidifier} style={{ width: '100%', height: '100%' }} autoPlay speed={1.6} />
                            </View>
                            <Text style={styles.CheckOutDescript}>
                                {`제습기를 비우고 다시 틀어주세요\n이 세가지 사진을 보여주세요`}
                            </Text>
                        </View>
                    </PagerView>
                </View>
                <View style={{
                    display: 'flex',
                    gap: 24,
                    paddingVertical: 12,
                    alignItems: 'center'
                }}>
                    <View style={styles.idicatorBackGround}>
                        {/* indicator */}
                        <View style={pageNum == 0 ? styles.indicatorSeleted : styles.indicator}>
                        </View>
                        <View style={pageNum == 1 ? styles.indicatorSeleted : styles.indicator}>
                        </View>
                        <View style={pageNum == 2 ? styles.indicatorSeleted : styles.indicator}>
                        </View>
                    </View>
                    <View style={styles.CTA}>
                        <LongButton color='blue' isAble={true} innerText={pageNum < 2 ? '다음' : '촬영하기'} onPress={() => { if (pageNum == 2) setStep('Camera'); else goToPage(); }} />
                    </View>
                </View>

            </View>
        )
    else {
        return (
            // 배경용
            <View style={styles.basicBackground}>
                <View style={{ flex: 1, flexDirection: 'column', display: 'flex', justifyContent: 'center', gap: 24, paddingTop: 160 }}>
                    <Text style={{
                        textAlign: 'center',
                        fontFamily: "NanumSquareNeo-Bold",
                        fontSize: 20,
                    }}>
                        연습실 정리 안내
                    </Text>
                    <PagerView
                        style={{
                            flex: 1
                        }}
                        initialPage={0}
                        onPageScroll={(e) => {
                            const { position, offset } = e.nativeEvent;
                            setPageNum(position);
                        }}

                        ref={pagerRef}>
                        <View style={{
                            alignItems: 'center'
                        }}
                            key={Pages[0]}>
                            <View style={[styles.CheckOutPicture,]}>
                                <LottieView source={Trash} style={{ width: '100%', height: '100%' }} autoPlay speed={1.6} />
                            </View>
                            <Text style={styles.CheckOutDescript}>
                                {`바닥을 정리하고 섭취한 음료들을\n버리고 연습실을 찍어주세요`}
                            </Text>
                        </View>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                        }}
                            key={Pages[1]}>
                            <View style={[styles.CheckOutPicture]}>
                                <LottieView source={Dehumidifier} style={{ width: '100%', height: '100%' }} autoPlay speed={0.8} />
                            </View>
                            <Text style={styles.CheckOutDescript}>
                                {`제습기를 비우고 다시 틀어주세요\n이 두 가지 사진을 보여주세요`}
                            </Text>
                        </View>
                    </PagerView>
                </View>
                <View style={{
                    display: 'flex',
                    gap: 24,
                    paddingVertical: 12,
                    alignItems: 'center'
                }}>
                    <View style={styles.idicatorBackGround}>
                        {/* indicator */}
                        <View style={pageNum == 0 ? styles.indicatorSeleted : styles.indicator}>
                        </View>
                        <View style={pageNum == 1 ? styles.indicatorSeleted : styles.indicator}>
                        </View>
                    </View>
                    <View style={styles.CTA}>
                        <LongButton color='blue' isAble={true} innerText={pageNum < 1 ? '다음' : '촬영하기'} onPress={() => { if (pageNum == 1) setStep('Camera'); else goToPage(); }} />
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    basicBackground: {
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#fff',
    },
    CheckOutPicture: {
        width: 400,
        height: 300,
    },
    CheckOutDescript: {
        fontFamily: "NanumSquareNeo-Bold",
        fontSize: 20,
        color: Color['grey700'],
        textAlign: 'center',
    },
    idicatorBackGround: {
        gap: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    indicator: {
        width: 8,
        height: 8,
        backgroundColor: Color["grey200"],
        borderRadius: 25,
    },
    indicatorSeleted: {
        width: 10,
        height: 10,
        backgroundColor: Color["blue500"],
        borderRadius: 25,
    },
    CTA: {
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 12
    }
})

export default CheckOutDescriptScreen;