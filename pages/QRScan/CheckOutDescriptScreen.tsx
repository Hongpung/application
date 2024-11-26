import { StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ShortButton from '../../components/buttons/ShortButton';
import LongButton from '../../components/buttons/LongButton';
import { Color } from '../../ColorSet';
import { TutorialEx } from '../../ExplainSet';
import PagerView from 'react-native-pager-view';


const CheckOutDescriptScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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

    return (
        // 배경용
        <View style={styles.basicBackground}>
            <Text style={{
                textAlign: 'center', top: 164,
                fontFamily: "NanumSquareNeo-Bold",
                fontSize: 20,
            }}>연습실 정리 안내</Text>
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
                    <View style={[styles.CheckOutPicture, { backgroundColor: "#dddddd" }]}>
                        {/* <Image source={require('사진 경로')}/> */}
                        {/* 나중에 위 코드로 바꿔서 넣으면 됨 */}
                        <Text>
                            사진 1
                        </Text>
                    </View>
                    <Text style={styles.CheckOutDescript}>
                        {'사용한 악기들을\n제자리에 돌려놓고 찍어주세요'}
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                }}
                    key={Pages[1]}>
                    <View style={[styles.CheckOutPicture, { backgroundColor: "#dddddd" }]}>
                        {/* <Image source={require('사진 경로')}/> */}
                        {/* 나중에 위 코드로 바꿔서 넣으면 됨 */}
                        <Text>
                            사진 2
                        </Text>
                    </View>
                    <Text style={styles.CheckOutDescript}>
                        {`바닥을 정리하고 섭취한 음료들을\n버리고 연습실을 찍어주세요`}
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                }}
                    key={Pages[2]}>
                    <View style={[styles.CheckOutPicture, { backgroundColor: "#dddddd" }]}>
                        {/* <Image source={require('사진 경로')}/> */}
                        {/* 나중에 위 코드로 바꿔서 넣으면 됨 */}
                        <Text>
                            사진 3
                        </Text>
                    </View>
                    <Text style={styles.CheckOutDescript}>
                        {`제습기를 비우고 다시 틀어주세요\n이 세가지 사진을 보여주세요`}
                    </Text>
                </View>
            </PagerView>
            <View style={{
                alignItems: 'center'
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
                    <LongButton color='blue' isAble={true} innerText={pageNum < 2 ? '다음' : '촬영하기'} onPress={() => { if (pageNum == 2) navigation.navigate('PictureCheck'); else goToPage(); }} />
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
    CheckOutPicture: {
        marginTop: 220,
        width: 200,
        height: 200,
        overflow: "hidden"
    },
    CheckOutDescript: {
        fontFamily: "NanumSquareNeo-Bold",
        marginTop: 24,
        fontSize: 20,
        width: 300,
        color: Color['grey700'],
        textAlign: 'center',
    },
    idicatorBackGround: {
        width: 48,
        bottom: 120,
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
        bottom: 8,
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 12
    }
})

export default CheckOutDescriptScreen;