import { StyleSheet, TextInput, Text, View, ScrollView, Image, Modal, Pressable, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, TextInputChangeEventData, NativeSyntheticEvent } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Color } from '../../../../ColorSet';
import { Instrument, InstrumentType, InstrumentTypes } from '../../../../UserType';
import LongButton from '../../../../components/buttons/LongButton';
import { useRecoilValue } from 'recoil';
import { loginUserState } from '@hongpung/recoil/authState';
import { Icons } from '@hongpung/components/Icon';
import { getToken } from '@hongpung/utils/TokenHandler';
import Toast from 'react-native-toast-message';


const showDeleteCompleteToast = () => {
    Toast.show({
        type: 'success',
        text1: '악기 삭제를 완료했어요!',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 2000
    });
};
const showCreateCompleteToast = () => {
    Toast.show({
        type: 'success',
        text1: '악기 등록을 완료했어요!',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 2000
    });
};
const showEditCompleteToast = () => {
    Toast.show({
        type: 'success',
        text1: '악기 수정을 완료했어요!',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 2000
    });
};


const InstrumentEditScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {

    const { instrumentInform } = route.params ?? { instrumentInform: null };

    const loginUser = useRecoilValue(loginUserState);
    const [aspectRatio, setAspectRatio] = useState<number | null>(null);
    const [modalImgWidth, setModalImgWidth] = useState(332);

    const [onSelectType, setSelectTypeVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);


    const [instrument, setInstrument] = useState<Instrument>(instrumentInform ? JSON.parse(instrumentInform) :
        { available: true, club: loginUser?.club, borrowHistory: [], name: '', instrumentId: -1, type: '쇠' })

    console.log(JSON.parse(instrumentInform), instrument)
    // '쇠' | '장구' | '북' | '소고' | '새납';
    const instrumentsEngType = ['KKWANGGWARI', 'JANGGU', 'BUK', 'SOGO', 'JING', 'ETC']

    const parseInstrument = (type: InstrumentType): string => {
        const instrumentEnumNo = InstrumentTypes.indexOf(type)
        return instrumentsEngType[instrumentEnumNo];
    }
    const dropdownCloseHandler = () => {
        if (onSelectType)
            setSelectTypeVisible(false)
    }

    const chageName = (e: string) => {
        setInstrument({ ...instrument, name: e })
    };

    const DeleteController = () => {
        const deleteInstrument = async () => {
            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            try {

                const token = await getToken('token');

                if (!token) throw Error('invalid Token');

                const response = await fetch(`${process.env.BASE_URL}/instrument/${instrument.instrumentId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
                    },
                    signal,
                })

                if (!response.ok) throw Error('Server Error' + response.status)

                showDeleteCompleteToast();
                navigation.navigate('InstrumentsHome');

            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.error('Request was canceled' + err.status);
                } else {
                    console.error(err.message + ' ' + err.status);
                }
            } finally {
                clearTimeout(timeoutId);
            }
        }
        deleteInstrument()
    }
    const SubmitController = () => {

        const editInstrument = async () => {
            console.log(instrument.instrumentId + `수정`)
            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            try {
                const token = await getToken('token');

                if (!token) throw Error('invalid Token');

                const submitForm = { name: instrument.name, type: parseInstrument(instrument.type), available: instrument.available }
                console.log(submitForm);
                const response = await fetch(`${process.env.BASE_URL}/instrument/${instrument.instrumentId}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(submitForm),
                    signal,
                })

                if (!response.ok) throw Error('Server Error' + response.status)

                showEditCompleteToast();
                navigation.goBack();
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.error('Request was canceled' + err.status);
                } else {
                    console.error(err.message + ' ' + err.status);
                }
            } finally {
                clearTimeout(timeoutId);
            }
        }

        const createInstrument = async () => {
            console.log(`신규 생성`)
            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            try {
                const token = await getToken('token');

                if (!token) throw Error('invalid Token');
                const submitForm = { name: instrument.name, type: parseInstrument(instrument.type) }
                console.log(submitForm);
                const response = await fetch(`${process.env.BASE_URL}/instrument`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(submitForm),
                    signal
                })
                if (!response.ok) throw Error('Server Error' + response.status)

                showCreateCompleteToast();
                navigation.goBack();

            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.error('Request was canceled' + err.status);
                } else {
                    console.error(err.message + ' ' + err.status);
                }
            } finally {
                clearTimeout(timeoutId);
            }

        }
        if (instrument.instrumentId != -1)
            editInstrument()
        else
            createInstrument()
    }

    useLayoutEffect(() => {
        if (instrument?.imgURL!)
            Image.getSize(instrument?.imgURL!, (width, height) => {
                setAspectRatio(width / height);
            }, (error) => {
                console.error(`Couldn't get the image size: ${error.message}`);
            });
        setModalImgWidth(340);
    }, [instrument]);

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); dropdownCloseHandler() }} >
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FFF" }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
                <View style={{ flex: 1, backgroundColor: `#FFF`, }}>
                    <ScrollView contentContainerStyle={{ alignItems: 'center', flex: 1 }}>
                        <View style={{ height: 12 }} />
                        <Pressable style={styles.imageContainer}
                            onPress={() => {
                                setModalVisible2(true);
                            }}>
                            {instrument?.imgURL ? <Image
                                source={{ uri: instrument?.imgURL }}
                                style={styles.image}
                            /> :
                                <View style={[styles.image, { backgroundColor: Color['grey200'] }]} />}
                            <Modal visible={modalVisible2} transparent={true}>
                                <Pressable onPress={() => setModalVisible2(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                                    {instrument?.imgURL ?
                                        <Image
                                            source={{ uri: instrument?.imgURL }}
                                            style={[styles.image, { width: modalImgWidth, height: modalImgWidth / aspectRatio!, borderRadius: 15 }]}
                                        /> :
                                        <View style={[styles.image, { backgroundColor: Color['grey200'] }]} />}
                                </Pressable>
                            </Modal>
                        </Pressable>
                        <View style={{ height: 28 }} />
                        <View style={styles.Row}>
                            <Text style={styles.RowLeft}>{`악기 이름`}</Text>
                            <TextInput value={instrument.name} onChangeText={chageName} style={[styles.RowRight, { borderBottomWidth: 0.5, paddingBottom: 4 }]} />

                        </View>

                        <View style={{ height: 14 }} />

                        <View style={[styles.Row, { zIndex: -1 }]}>
                            <Text style={styles.RowLeft}>{`악기 타입`}</Text>
                            <Pressable style={{ position: 'relative', zIndex: 0 }}
                                onPress={() => { Keyboard.dismiss(); setSelectTypeVisible(true); }}>
                                <Text style={styles.RowRight}>{instrument.type}</Text>
                                {
                                    onSelectType && <View style={{
                                        position: 'absolute', top: 0, right: 0, zIndex: 2, width: 120, backgroundColor: '#FFF', alignItems: 'flex-start', paddingHorizontal: 16, borderRadius: 5, shadowColor: Color['grey700'],
                                        shadowOffset: { width: -2, height: 2 }, // 그림자 오프셋 (x, y)
                                        shadowOpacity: 0.1,         // 그림자 투명도 (0에서 1)
                                        shadowRadius: 5,          // 그림자 반경
                                        elevation: 5,
                                        height: 180,
                                    }}>
                                        <ScrollView
                                            contentContainerStyle={{ alignItems: 'flex-start' }}
                                            showsVerticalScrollIndicator={false}
                                        >{InstrumentTypes.map((item) => {
                                            return (
                                                <Pressable
                                                    key={item + 'seletor'}
                                                    style={{ paddingVertical: 4, marginVertical: 4, width: 120 - 32, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row-reverse' }}
                                                    onPress={() => { setInstrument({ ...instrument, type: item }); setSelectTypeVisible(false); }}>
                                                    <Text style={[{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, color: instrument.type == item ? Color['green600'] : Color['grey400'] }]}>{item}</Text>
                                                    {instrument.type == item && <Icons name='checkmark' color={Color['green500']} size={24} />}
                                                </Pressable>
                                            )
                                        })}</ScrollView>
                                    </View>
                                }
                            </Pressable>

                        </View>

                    </ScrollView >

                    {instrument.instrumentId != -1 && <>
                        <View style={{ height: 8 }} />
                        <LongButton color='red' innerText='삭제하기' isAble={true} onPress={() => DeleteController()} />
                    </>}
                    <View style={{ height: 8 }} />
                    <LongButton color='blue' innerText='저장하기' isAble={true} onPress={() => SubmitController()} />
                    <View style={{ height: 8 }} />
                </View >
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default InstrumentEditScreen

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
        width: 80,
        textAlign: 'right',
        fontFamily: "NanumSquareNeo-Regular",
        fontSize: 16,
        color: Color['grey700']
    }
})

