import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useRef, useState } from 'react'

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';

import ShortButton from '@hongpung/components/buttons/ShortButton';
import LongButton from '@hongpung/components/buttons/LongButton';
import { Color } from '@hongpung/ColorSet';
import { RootStackParamList } from '@hongpung/pageTypes';


type TutorialProp = NativeStackNavigationProp<RootStackParamList, "Tutorial">;

const TutorialScreen: React.FC = () => {

    const navigation = useNavigation<TutorialProp>();

    const Pages = ["0", "1", "2"]
    const [pageNum, setPageNum] = useState(0);
    const photo = 'phptoUrl'//나중에 추가할것

    const pagerRef = useRef<PagerView>(null);//러페런스 추가
    // 페이지 이동 함수
    const goToPage = () => {
        if (pagerRef.current) {
            pagerRef.current.setPage(pageNum + 1);
        }
    };

    const SkipHandler = () => {
        navigation.replace('Permission')
    }

    return (
        // 배경용
        <View style={styles.basicBackground}>
            <PagerView
                style={{ flex: 1 }}
                initialPage={0}
                orientation="horizontal"
                removeClippedSubviews={true}
                scrollEnabled
                ref={pagerRef}
                onPageScroll={(e) => { const { position, offset } = e.nativeEvent; setPageNum(position); }}
            >
                <View key="page-1" style={{ alignItems: 'center', backgroundColor: '#FFF', gap: 12, paddingVertical: 24 }}>

                    <Image
                        source={require('@hongpung/assets/images/tutorial/Tutorial-1.png')}
                        style={{ resizeMode: 'contain', width: 320, height: '100%' }} width={320} height={680} />
                </View>

                <View key="page-2" style={{ alignItems: 'center', backgroundColor: '#FFF', gap: 12, paddingVertical: 24 }}>

                    <Image
                        source={require('@hongpung/assets/images/tutorial/Tutorial-2.png')}
                        style={{ resizeMode: 'contain', width: 320, height: '100%'  }} width={320} height={680} />
                </View>

                <View key="page-3" style={{ alignItems: 'center', backgroundColor: '#FFF', gap: 12, paddingVertical: 24 }}>

                    <Image
                        source={require('@hongpung/assets/images/tutorial/Tutorial-3.png')}
                        style={{ resizeMode: 'contain',width: 320, height: '100%'  }} width={320} height={680} />
                </View>
                {/* <View style={{
                    flex: 1,
                    alignItems: 'center',
                }}
                    key={Pages[1]}>
                    <View style={[styles.TutorialPicture, { backgroundColor: "#dddddd" }]}>
                        <Text>
                            사진 2
                        </Text>
                    </View>
                    <Text style={styles.TutorialDescript}>
                        {TutorialEx[Pages[1]]}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        width: '100%',
                        alignItems: 'center',
                    }}
                    key={Pages[2]}>
                    <View style={[styles.TutorialPicture, { backgroundColor: "#dddddd" }]}>

                        <Text>
                            사진 3
                        </Text>
                    </View>
                    <Text style={styles.TutorialDescript}>
                        {TutorialEx[Pages[2]]}
                    </Text>
                </View> */}
            </PagerView>
            <View
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    gap: 24,
                    paddingBottom: 12
                }}
            >
                <View style={styles.idicatorBackGround}>
                    <View style={pageNum == 0 ? styles.indicatorSeleted : styles.indicator}>
                    </View>
                    <View style={pageNum == 1 ? styles.indicatorSeleted : styles.indicator}>
                    </View>
                    <View style={pageNum == 2 ? styles.indicatorSeleted : styles.indicator}>
                    </View>
                </View>
                <View style={styles.CTA}>
                    {pageNum < 2 ?
                        <>
                            <ShortButton
                                innerText={'건너뛰기'}
                                isFilled={true}
                                color={'blue'}
                                onPress={SkipHandler}
                            />
                            <ShortButton
                                innerText={'다음'}
                                isFilled={false}
                                color={'blue'}
                                onPress={goToPage}
                            />
                        </>
                        :
                        <View style={{ width: '100%' }}>
                            <LongButton
                                innerText={'이해했어요'}
                                isAble={true}
                                color={'blue'}
                                onPress={SkipHandler}
                            />
                        </View>
                    }
                </View>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    basicBackground: {
        flex: 1,
        // paddingVertical: 32,
        backgroundColor: '#fff',
    },
    TutorialPicture: {
        width: '100%',
        flex: 1
    },
    TutorialDescript: {
        fontFamily: "NanumSquareNeo-ExtraBold",
        fontSize: 16,
        fontWeight: 600,
        color: Color['blue500'],
        textAlign: 'center',
    },
    idicatorBackGround: {
        gap: 12,
        flexDirection: 'row',
        justifyContent: 'space-around',
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
        flexDirection: 'row',
        paddingHorizontal: 32,
        width: '100%',
        justifyContent: 'space-around',
    }
})

export default TutorialScreen;