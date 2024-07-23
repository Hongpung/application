import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ShortButton from '../buttons/ShortButton';
import LongButton from '../buttons/LongButton';
import { Color } from '../../ColorSet';
import { TutorialEx } from '../../ExplainSet';
import { RootStackParamList } from './pageTypes';

type TutorialProps = NativeStackScreenProps<RootStackParamList, "Tutorial">;

export const Tutorial:React.FC<TutorialProps> = ({ navigation, route }) => {
    const { Step } = route.params;
    const descript = TutorialEx[Step];
    const photo = 'phptoUrl'//나중에 추가할것
    const goToNextStep = () => {
        navigation.navigate(`Tutorial`, { Step: Step + 1 });
    };
    const SkipHandler =()=>{
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
    }
    return (
        //배경용
        <View style={styles.basicBackground}>
            <View style={styles.TutorialPicture}>
                <Text> {photo}</Text>
                {/* <Image source={require('사진 경로')}/> */}
                {/* 나중에 위 코드로 바꿔서 넣으면 됨 */}
            </View>
            <Text style={{ marginTop: 115, fontSize: 16, fontWeight: 600, width: 280, color: Color['blue500'], textAlign: 'center', height: 56 }}>
                {descript}
            </Text>
            <View style={{
                position: 'absolute', flexDirection: 'row', bottom: 72, justifyContent: 'space-between', width: 320
            }}>
                {Step < 3 ? (
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
                            onPress={goToNextStep}
                        />
                    </>
                ) : (
                    <LongButton
                        innerText={'이해했어요'}
                        isAble={true}
                        color={'blue'}
                        onPress={SkipHandler}
                    />
                )}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    basicBackground: {
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: 24,
        paddingRight: 24
    },
    TutorialPicture: {
        marginTop: 120,
        width: 250,
        height: 250,
        borderWidth: 1,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Color['blue500']
    },
})