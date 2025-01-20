import { StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ShortButton from '@hongpung/components/buttons/ShortButton';
import LongButton from '@hongpung/components/buttons/LongButton';
import { Color } from '@hongpung/ColorSet';
import { TutorialEx } from '@hongpung/ExplainSet';
import { RootStackParamList } from '@hongpung/pageTypes';
import PagerView from 'react-native-pager-view';

type TutorialProps = NativeStackScreenProps<RootStackParamList, "Tutorial">;

const Tutorial: React.FC<TutorialProps> = ({ navigation }) => {
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
    const SkipHandler = () => {
        navigation.replace('Permission')
    }

    return (
        // 배경용
        <View style={styles.basicBackground}>
            <PagerView style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }} initialPage={0}
                onPageScroll={(e) => { const { position, offset } = e.nativeEvent; setPageNum(position); }}
                ref={pagerRef}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                }}
                    key={Pages[0]}>
                    <View style={[styles.TutorialPicture, { backgroundColor: "#dddddd" }]}>
                        {/* <Image source={require('사진 경로')}/> */}
                        {/* 나중에 위 코드로 바꿔서 넣으면 됨 */}
                        <Text>
                            사진 1
                        </Text>
                    </View>
                    <Text style={styles.TutorialDescript}>
                        {TutorialEx[Pages[0]]}
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                }}
                    key={Pages[1]}>
                    <View style={[styles.TutorialPicture, { backgroundColor: "#dddddd" }]}>
                        {/* <Image source={require('사진 경로')}/> */}
                        {/* 나중에 위 코드로 바꿔서 넣으면 됨 */}
                        <Text>
                            사진 2
                        </Text>
                    </View>
                    <Text style={styles.TutorialDescript}>
                        {TutorialEx[Pages[1]]}
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                }}
                    key={Pages[2]}>
                    <View style={[styles.TutorialPicture, { backgroundColor: "#dddddd" }]}>
                        {/* <Image source={require('사진 경로')}/> */}
                        {/* 나중에 위 코드로 바꿔서 넣으면 됨 */}
                        <Text>
                            사진 3
                        </Text>
                    </View>
                    <Text style={styles.TutorialDescript}>
                        {TutorialEx[Pages[2]]}
                    </Text>
                </View>
            </PagerView>
            <View style={{
                alignItems: 'center',
                height: 230
            }}><View style={styles.idicatorBackGround}>
                    {/* indicator */}
                    <View style={pageNum == 0 ? styles.indicatorSeleted : styles.indicator}>
                    </View>
                    <View style={pageNum == 1 ? styles.indicatorSeleted : styles.indicator}>
                    </View>
                    <View style={pageNum == 2 ? styles.indicatorSeleted : styles.indicator}>
                    </View>
                </View>
                <View style={styles.CTA}>
                    {pageNum < 2 ? (
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
                    ) : (
                        <View style={{ flexGrow: 1 }}>
                            <LongButton
                                innerText={'이해했어요'}
                                isAble={true}
                                color={'blue'}
                                onPress={SkipHandler}
                            />
                        </View>
                    )}
                </View>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    basicBackground: {
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#fff',
    },
    TutorialPicture: {
        marginTop: 120,
        width: 300,
        height: 300,
        overflow: "hidden"
    },
    TutorialDescript: {
        fontFamily: "NanumSquareNeo-ExtraBold",
        marginTop: 40,
        fontSize: 16,
        fontWeight: 600,
        width: 300,
        color: Color['blue500'],
        textAlign: 'center',
        height: 56
    },
    idicatorBackGround: {
        width: 48,
        bottom: 180,
        position: 'absolute',
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
        position: 'absolute',
        flexDirection: 'row',
        bottom: 72,
        paddingHorizontal: 32,
        width: '100%',
        justifyContent: 'space-around',
        flex: 1,
    }
})

export default Tutorial;