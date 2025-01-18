import { Pressable, ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { InstrumentWithOutBorrowHistory, instrumentOrder } from '@hongpung/UserType'
import InstrumentCard from '@hongpung/components/cards/InstrumentCard'
import { Color } from '@hongpung/ColorSet'
import LongButton from '@hongpung/components/buttons/LongButton'
import { useReservation } from '@hongpung/pages/Reserve/context/ReservationContext'
import Header from '@hongpung/components/Header'
import useFetchUsingToken from '@hongpung/hoc/useFetchUsingToken'
import { Icons } from '@hongpung/components/Icon'

const BorrowInstrumentSelectScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

    const { data, loading, error } = useFetchUsingToken<InstrumentWithOutBorrowHistory[]>(
        `${process.env.SUB_API}/instrument/borrow-list`, {}, 5000, []
    )
    const { reservation, setBorrowInstruments } = useReservation();

    const [originList, setOrigin] = useState<InstrumentWithOutBorrowHistory[]>([])

    useEffect(() => {
        setOrigin(reservation.borrowInstruments);
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Header leftButton='close' HeaderName='대여 악기 선택' addLeftAction={() => setBorrowInstruments(originList)} />
            <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: '#FFF' }}>
                {data && data?.length == 0 ?
                    <View >
                        <Text style={{ marginHorizontal:'auto', marginTop:300, fontFamily: 'NanumSquareNeo-Bold', fontSize: 18, color:Color['grey400'] }}>대여 할 수 있는 악기가 없습니다.</Text>
                    </View>
                    :
                    <View style={{ flex: 1, marginHorizontal: 24 }}>
                        <InstrumentsList instrumentsList={data ?? []} />
                    </View>}
            </ScrollView >
            {
                reservation.borrowInstruments.length > 0 && <View style={{ paddingTop: 12, width: '100%' }}>
                    <LongButton
                        color='blue'
                        isAble={true}
                        innerText={`선택완료 (${reservation.borrowInstruments.length})`}
                        onPress={() => navigation.pop()}
                    />
                </View>
            }
        </View >
    )
}

const InstrumentsList: React.FC<{ instrumentsList: InstrumentWithOutBorrowHistory[] }> = ({ instrumentsList }) => {

    const { setBorrowInstruments, reservation } = useReservation();

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
            case '꽹과리': return toggleGGwang;
            case '장구': return toggleJanggu;
            case '북': return toggleBuk;
            case '소고': return toggleSogo;
            case '기타': return toggleETC;
            default: return () => { };
        }
    };

    const isOpen = (type: string) => {
        switch (type) {
            case '꽹과리': return isGGwangOpen;
            case '장구': return isJangguOpen;
            case '북': return isBukOpen;
            case '소고': return isSogoOpen;
            case '기타': return isETCOpen;
            default: return false;
        }
    }
    const getCount = (type: string) => {
        switch (type) {
            case '꽹과리': return GGwangSelected;
            case '장구': return JangguSelected;
            case '북': return BukSelected;
            case '소고': return SogoSelected;
            case '기타': return ETCSelected;
            default: return 0;
        }
    }

    const haveSameInstrument = (existInstruments: InstrumentWithOutBorrowHistory[], instrument: InstrumentWithOutBorrowHistory) => existInstruments.some(existInstrument => JSON.stringify(existInstrument) === JSON.stringify(instrument));

    useEffect(() => {
        setGGwangSelected(reservation.borrowInstruments.filter((instrument) => instrument.instrumentType == '꽹과리').length)
        setJangguSelected(reservation.borrowInstruments.filter((instrument) => instrument.instrumentType == '장구').length)
        setBukSelected(reservation.borrowInstruments.filter((instrument) => instrument.instrumentType == '북').length)
        setSogoSelected(reservation.borrowInstruments.filter((instrument) => instrument.instrumentType == '소고').length)
        setETCSelected(reservation.borrowInstruments.filter((instrument) => instrument.instrumentType == '기타').length)
    }, [])

    const addInstruments = (instrument: InstrumentWithOutBorrowHistory) => {

        setBorrowInstruments([...reservation.borrowInstruments, instrument])
        switch (instrument.instrumentType) {
            case '꽹과리':
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

    const removeInstruments = (instrument: InstrumentWithOutBorrowHistory) => {
        setBorrowInstruments(reservation.borrowInstruments.filter((existInstrument) => JSON.stringify(existInstrument) != JSON.stringify(instrument)))

        switch (instrument.instrumentType) {
            case '꽹과리':
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
        let cnt = instrumentOrder(instrumentsList[0]?.instrumentType) - 1;
        for (let i = 0; i < instrumentsList.length;) {
            let sliceCnt = 2;
            if (instrumentsList[i].instrumentType != instrumentsList[i + 1]?.instrumentType) sliceCnt = 1;
            const group = instrumentsList.slice(i, i + sliceCnt);
            if (cnt < instrumentOrder(group[0].instrumentType)) {
                const selectedCount = getCount(group[0].instrumentType);
                rows.push(
                    <Pressable key={group[0].instrumentType + 'header'}
                        style={{ paddingVertical: 16, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        onPress={toggleFunction(group[0].instrumentType)}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 24, height: 24, backgroundColor: Color['grey400'] }} />
                            <Text style={[{ fontSize: 18, color: Color['grey400'], marginLeft: 8 }, selectedCount > 0 && { color: Color['blue500'] }]}>
                                {group[0].instrumentType} {selectedCount > 0 && `(` + selectedCount + `)`}
                            </Text>
                        </View>
                        <Icons name={isOpen(instrumentsList[i].instrumentType) ? 'chevron-up' : 'chevron-down'} size={24} color={Color['grey300']} />
                    </Pressable>
                )
                cnt++;
            }
            rows.push(
                <View>
                    {isOpen(instrumentsList[i].instrumentType) && <View key={i} style={{ height: 168, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4, marginHorizontal: 12 }}>
                        {group.map((instrument, index) => (
                            <InstrumentCard
                                key={instrument.name + instrument.imageUrl?.slice(-10, -5) + index}
                                instrument={instrument}
                                view="inBorrow"
                                isPicked={haveSameInstrument(reservation.borrowInstruments, instrument)}
                                onClickInstrument={(item: InstrumentWithOutBorrowHistory) => {
                                    if (haveSameInstrument(reservation.borrowInstruments, item))
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
        <View style={{ flex: 1 }}>
            <ScrollView>{renderInstruments()}</ScrollView>
        </View>
    )
}


export default BorrowInstrumentSelectScreen