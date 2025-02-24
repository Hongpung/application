import { Alert, BackHandler, Platform, Pressable, ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { InstrumentWithOutBorrowHistory } from '@hongpung/UserType'
import InstrumentCard from '@hongpung/components/cards/InstrumentCard'
import { Color } from '@hongpung/ColorSet'
import LongButton from '@hongpung/src/common/components/buttons/long-button'
import { useReservation } from '@hongpung/pages/Reservation/context/ReservationContext'
import Header from '@hongpung/src/common/components/header/Header'
import useFetchUsingToken from '@hongpung/src/common/hooks/useFetchUsingToken'
import { Icons } from '@hongpung/src/common/components/icons/Icon'
import { useNavigation } from '@react-navigation/native'
import usePreventRemove from '@react-navigation/core/src/usePreventRemove'

const BorrowInstrumentSelectScreen: React.FC = () => {

    const navigation = useNavigation();

    const { data, loading, error } = useFetchUsingToken<InstrumentWithOutBorrowHistory[]>(
        `${process.env.EXPO_PUBLIC_BASE_URL}/instrument/borrow-list`, {}, 5000, []
    )
    const { reservation, setBorrowInstruments } = useReservation();

    const [originList, setOrigin] = useState<InstrumentWithOutBorrowHistory[]>([])

    useEffect(() => {
        setOrigin(reservation.borrowInstruments);
    }, [])

    // const hasUnsavedChanges = Boolean('sss');

    // usePreventRemove(hasUnsavedChanges, ({ data }) => {
    //     if (Platform.OS === 'web') {
    //         const discard = confirm(
    //             'You have unsaved changes. Discard them and leave the screen?'
    //         );

    //         if (discard) {
    //             navigation.dispatch(data.action);
    //         }
    //     } else {

    //         Alert.alert('종료', '선택을 취소할까요?', [
    //             { text: '취소', style: 'cancel' },
    //             { text: '확인', style: 'destructive', onPress: () => { setBorrowInstruments(originList); navigation.dispatch(data.action); } },
    //         ]);

    //         return true;  // 기본 뒤로가기 동작을 막음

    //     }
    // });

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Header leftButton='close' HeaderName='대여 악기 선택' />
            <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: '#FFF' }}>
                {data && data?.length == 0 ?
                    <View >
                        <Text style={{ marginHorizontal: 'auto', marginTop: 300, fontFamily: 'NanumSquareNeo-Bold', fontSize: 18, color: Color['grey400'] }}>대여 할 수 있는 악기가 없습니다.</Text>
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
                        onPress={() => navigation.goBack()}
                    />
                </View>
            }
        </View >
    )
}

const InstrumentsList: React.FC<{ instrumentsList: InstrumentWithOutBorrowHistory[] }> = ({ instrumentsList }) => {

    const { setBorrowInstruments, reservation } = useReservation();

    const [isGGwangOpen, setGGwangOpen] = useState(false);
    const [isJingOpen, setJingOpen] = useState(false);
    const [isJangguOpen, setJangguOpen] = useState(false);
    const [isBukOpen, setBukOpen] = useState(false);
    const [isSogoOpen, setSogoOpen] = useState(false);
    const [isETCOpen, setETCOpen] = useState(false);

    const toggleGGwang = () => setGGwangOpen(!isGGwangOpen);
    const toggleJing = () => setJingOpen(!isJingOpen);
    const toggleJanggu = () => setJangguOpen(!isJangguOpen);
    const toggleBuk = () => setBukOpen(!isBukOpen);
    const toggleSogo = () => setSogoOpen(!isSogoOpen);
    const toggleETC = () => setETCOpen(!isETCOpen);



    const toggleFunction = (type: string) => {
        switch (type) {
            case '꽹과리': return toggleGGwang;
            case '징': return toggleJing;
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
            case '징': return isJingOpen;
            case '장구': return isJangguOpen;
            case '북': return isBukOpen;
            case '소고': return isSogoOpen;
            case '기타': return isETCOpen;
            default: return false;
        }
    }


    const haveSameInstrument = (existInstruments: InstrumentWithOutBorrowHistory[], instrument: InstrumentWithOutBorrowHistory): boolean => existInstruments.some(existInstrument => existInstrument.instrumentId === instrument.instrumentId);



    const addInstruments = (instrument: InstrumentWithOutBorrowHistory) => {

        setBorrowInstruments([...reservation.borrowInstruments, instrument])
    }

    const removeInstruments = (instrument: InstrumentWithOutBorrowHistory) => {
        setBorrowInstruments(reservation.borrowInstruments.filter((existInstrument) => existInstrument.instrumentId != instrument.instrumentId))
    }

    const orderInstruments = () => {
        const instrumnentMappedByType: Record<string, InstrumentWithOutBorrowHistory[]> = {
            "꽹과리": [],
            "징": [],
            "장구": [],
            "북": [],
            "소고": [],
            "기타": []
        };

        instrumentsList.forEach((instrument) => {
            if (instrumnentMappedByType[instrument.instrumentType] == undefined)
                instrumnentMappedByType[instrument.instrumentType] = [];
            instrumnentMappedByType[instrument.instrumentType].push(instrument);
        });

        return instrumnentMappedByType;

    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                {
                    Object.entries(orderInstruments()).map(([type, instruments]) => {
                        if (instruments.length == 0) return null;

                        const selectedCount = instruments.filter((instrument) => haveSameInstrument(reservation.borrowInstruments, instrument) && instrument.instrumentType === type).length;

                        const hasSelected = selectedCount > 0;

                        return (
                            <View key={type}>
                                <Pressable onPress={toggleFunction(type)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8 }}>

                                    <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 18, color: hasSelected ? Color['blue500'] : Color['grey800'] }}>
                                        {type}{selectedCount > 0 && ` (${selectedCount})`}
                                    </Text>
                                    <Icons name={isOpen(type) ? 'chevron-up' : 'chevron-down'} color={Color['grey800']} size={24} />

                                </Pressable>
                                {isOpen(type) &&
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 8, rowGap: 16, paddingVertical: 12 }}>
                                        {
                                            instruments.map((instrument, index) => {
                                                return (
                                                    <InstrumentCard
                                                        key={index}
                                                        instrument={instrument}
                                                        isPicked={haveSameInstrument(reservation.borrowInstruments, instrument)}
                                                        onClickInstrument={() => haveSameInstrument(reservation.borrowInstruments, instrument) ? removeInstruments(instrument) : addInstruments(instrument)}
                                                        view='inBorrow'
                                                    />
                                                )
                                            })
                                        }

                                    </View>
                                }
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}


export default BorrowInstrumentSelectScreen