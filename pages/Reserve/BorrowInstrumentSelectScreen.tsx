import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Instrument, instrumentOrder } from '../../UserType'
import InstrumentCard from '../../components/cards/InstrumentCard'
import { Color } from '../../ColorSet'
import { InstrumentProvider, useInstrument } from '../Home/MyClub/Instruments/context/InstrumentContext'
import LongButton from '../../components/buttons/LongButton'

const BorrowInstrumentSelectScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const instruments: Instrument[] = [{
        imgURL: 'https://postfiles.pstatic.net/MjAyNDA3MDdfMjQy/MDAxNzIwMzYwODg3Mzg3.siw5LvdkA7a4MPbS07jHAIFKw7GzlIdHbvJ4qvMeoJog.fiYaRMvdmmfUe56jgp-hQ8C5kWM20zJB1kLzAEQXakIg.JPEG/KakaoTalk_20240707_225628831_01.jpg?type=w386',
        name: "길동무",
        type: '쇠',
        club: '들녘',
        nickname: '바보',
        owner: '홍길동'
    }, {
        imgURL: 'https://postfiles.pstatic.net/MjAyNDA3MDdfMjQy/MDAxNzIwMzYwODg3Mzg3.siw5LvdkA7a4MPbS07jHAIFKw7GzlIdHbvJ4qvMeoJog.fiYaRMvdmmfUe56jgp-hQ8C5kWM20zJB1kLzAEQXakIg.JPEG/KakaoTalk_20240707_225628831_01.jpg?type=w386',
        name: "길동무",
        type: '쇠',
        club: '들녘',
        nickname: '바보',
        owner: '홍길동'
    }, {
        imgURL: 'https://postfiles.pstatic.net/MjAyNDA3MDdfMjQy/MDAxNzIwMzYwODg3Mzg3.siw5LvdkA7a4MPbS07jHAIFKw7GzlIdHbvJ4qvMeoJog.fiYaRMvdmmfUe56jgp-hQ8C5kWM20zJB1kLzAEQXakIg.JPEG/KakaoTalk_20240707_225628831_01.jpg?type=w386',
        name: "길동무",
        type: '장구',
        club: '들녘',
        nickname: '바보',
        owner: '홍길동'
    }
    ]

    return (
        <InstrumentProvider>
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: '#FFF' }}>
                    <View style={{ flex: 1, marginHorizontal: 24 }}>
                        <InstrumentsList instrumentsList={instruments} navigation={navigation} />
                    </View>
                </ScrollView>
            </View>
        </InstrumentProvider>
    )
}

const InstrumentsList: React.FC<{ instrumentsList: Instrument[], navigation: any }> = ({ instrumentsList, navigation }) => {

    const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([]);
    const [isGGwangOpen, setGGwangOpen] = useState(false);
    const [isJangguOpen, setJangguOpen] = useState(false);
    const [isBukOpen, setBukOpen] = useState(false);
    const [isSogoOpen, setSogoOpen] = useState(false);
    const [isETCOpen, setETCOpen] = useState(false);

    const toggleGGwang = () => setGGwangOpen(!isGGwangOpen);
    const toggleJanggu = () => setJangguOpen(!isJangguOpen);
    const toggleBuk = () => setBukOpen(!isBukOpen);
    const toggleSogo = () => setSogoOpen(!isSogoOpen);
    const toggleETC = () => setETCOpen(!isETCOpen);

    const [GGwangSelected, setGGwangSelected] = useState(0);
    const [JangguSelected, setJangguSelected] = useState(0);
    const [BukSelected, setBukSelected] = useState(0);
    const [SogoSelected, setSogoSelected] = useState(0);
    const [ETCSelected, setETCSelected] = useState(0);

    const toggleFunction = (type: string) => {
        switch (type) {
            case '쇠': return toggleGGwang;
            case '장구': return toggleJanggu;
            case '북': return toggleBuk;
            case '소고': return toggleSogo;
            case '기타': return toggleETC;
            default: return () => { };
        }
    };

    const isOpen = (type: string) => {
        switch (type) {
            case '쇠': return isGGwangOpen;
            case '장구': return isJangguOpen;
            case '북': return isBukOpen;
            case '소고': return isSogoOpen;
            case '기타': return isETCOpen;
            default: return false;
        }
    }
    const getCount = (type: string) => {
        switch (type) {
            case '쇠': return GGwangSelected;
            case '장구': return JangguSelected;
            case '북': return BukSelected;
            case '소고': return SogoSelected;
            case '기타': return ETCSelected;
            default: return 0;
        }
    }
    const addInstruments = (instrument: Instrument) => {
        setSelectedInstruments([instrument, ...selectedInstruments])
        switch (instrument.type) {
            case '쇠':
                setGGwangSelected(prevCount => prevCount + 1);
                break;
            case '장구':
                setJangguSelected(prevCount => prevCount + 1);
                break;
            case '북':
                setBukSelected(prevCount => prevCount + 1);
                break;
            case '소고':
                setSogoSelected(prevCount => prevCount + 1);
                break;
            default:
                break;
        }
    }

    const removeInstruments = (instrument: Instrument) => {
        setSelectedInstruments(selectedInstruments.filter((item) => item != instrument))
        switch (instrument.type) {
            case '쇠':
                setGGwangSelected(prevCount => prevCount > 0 ? prevCount - 1 : 0);
                break;
            case '장구':
                setJangguSelected(prevCount => prevCount > 0 ? prevCount - 1 : 0);
                break;
            case '북':
                setBukSelected(prevCount => prevCount > 0 ? prevCount - 1 : 0);
                break;
            case '소고':
                setSogoSelected(prevCount => prevCount > 0 ? prevCount - 1 : 0);
                break;
            default:
                break;
        }
    }



    const renderInstruments = () => {
        const rows = [];
        let cnt = instrumentOrder(instrumentsList[0].type) - 1;
        for (let i = 0; i < instrumentsList.length;) {
            let sliceCnt = 2;
            if (instrumentsList[i].type != instrumentsList[i + 1]?.type) sliceCnt = 1;
            const group = instrumentsList.slice(i, i + sliceCnt);
            if (cnt < instrumentOrder(group[0].type)) {
                const selectedCount = getCount(group[0].type);
                rows.push(
                    <Pressable key={group[0].type + 'header'} style={{ paddingVertical: 16, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        onPress={toggleFunction(group[0].type)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 24, height: 24, backgroundColor: Color['grey400'] }} />
                            <Text style={[{ fontSize: 18, color: Color['grey400'], marginLeft: 8 }, selectedCount > 0 && { color: Color['blue500'] }]}>
                                {group[0].type} {selectedCount > 0 && `(` + selectedCount + `)`}
                            </Text>
                        </View>
                        <View style={{ width: 24, height: 24, backgroundColor: Color['grey200'] }} />
                    </Pressable>
                )
                cnt++;
            }
            rows.push(
                <View>
                    {isOpen(instrumentsList[i].type) && <View key={i} style={{ height: 168, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4, marginHorizontal: 12 }}>
                        {group.map((instrument, index) => (
                            <InstrumentCard
                                key={instrument.name + index}
                                instrument={instrument}
                                view="inBorrow"
                                navigation={navigation}
                                isPicked={selectedInstruments.includes(instrument)}
                                onSelectInstrument={(item: Instrument) => {
                                    if (selectedInstruments.includes(item))
                                        removeInstruments(item)
                                    else
                                        addInstruments(item)
                                }}
                            />
                        ))}
                        {group.length % 2 == 1 && <View style={{ height: 168, width: 154 }} />}
                    </View>}
                </View>

            );
            i += sliceCnt;
        }
        return rows;
    };
    return (
        <View style={{ flex: 1, }}>
            <ScrollView>{renderInstruments()}</ScrollView>
            {selectedInstruments.length>0&&<View style={{paddingTop:12, width:'100%'}}>
                <LongButton
                    color='blue'
                    isAble={true}
                    innerText={`선택완료 (${selectedInstruments.length})`}
                    onPress={()=>navigation.pop()}
                />
            </View>}
        </View>
    )
}


export default BorrowInstrumentSelectScreen