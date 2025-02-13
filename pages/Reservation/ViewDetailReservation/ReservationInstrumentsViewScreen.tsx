import { ScrollView, View, Text } from "react-native"
import { useEffect, useState } from "react"
import { useIsFocused, useNavigation } from "@react-navigation/native"

import InstrumentCard from "@hongpung/components/cards/InstrumentCard"
import { InstrumentWithOutBorrowHistory, instrumentOrder } from "@hongpung/UserType"
import { Color } from "@hongpung/ColorSet"

import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import { ReservationStackParamList } from "@hongpung/nav/ReservationStack"
import { MainStackParamList } from "@hongpung/nav/HomeStacks"

type InstrumentNavParams = NativeStackNavigationProp<MainStackParamList, 'Home'>

const BorrowInstrumentsList: React.FC<{ instrumentList: InstrumentWithOutBorrowHistory[] }> = ({ instrumentList }) => {

    const navigation = useNavigation<InstrumentNavParams>();

    const orderInstruments = () => {
        const instrumnentMappedByType: Record<string, InstrumentWithOutBorrowHistory[]> = {
            "꽹과리": [],
            "징": [],
            "장구": [],
            "북": [],
            "소고": [],
            "기타": []
        };

        instrumentList.forEach((instrument) => {
            if (instrumnentMappedByType[instrument.instrumentType] == undefined)
                instrumnentMappedByType[instrument.instrumentType] = [];
            instrumnentMappedByType[instrument.instrumentType].push(instrument);
        });

        return instrumnentMappedByType;
    };

    return (
        <View style={{ flex: 1, marginHorizontal: 24 }}>
            {
                Object.entries(orderInstruments()).map(([type, instruments]) => {
                    if (instruments.length == 0) return null;

                    return (
                        <View key={type}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 12, width: '100%', paddingHorizontal: 8 }}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 18, color: Color['grey500'] }}>
                                    {type}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 8, rowGap: 16, paddingVertical: 12 }}>

                                {
                                    instruments.map((instrument, index) => {
                                        return (
                                            <InstrumentCard
                                                key={instrument.name + index}
                                                instrument={instrument}
                                                view="inBorrow"
                                                onClickInstrument={(instrument) => { navigation.navigate('MyClub', { screen: 'Instruments', params: { screen: 'InstrumentSpecific', params: { instrumentId: instrument.instrumentId } } }); }}
                                            />
                                        )
                                    })
                                }

                            </View>

                        </View>
                    )
                })
            }
        </View>
    )
}

type ReservationInstrumentsViewProps = NativeStackScreenProps<ReservationStackParamList, 'ReservationInstrumentsView'>

const ReservationInstrumentsViewScreen: React.FC<ReservationInstrumentsViewProps> = ({ navigation, route }) => {

    const [instrumentList, setInstrumentList] = useState<InstrumentWithOutBorrowHistory[]>([])

    useEffect(() => {
        const { instruments } = route.params
        const borrowInstruements = instruments ? JSON.parse(instruments) as InstrumentWithOutBorrowHistory[] : [];
        console.log(borrowInstruements);
        borrowInstruements?.sort((a, b) => instrumentOrder(a.instrumentType) - instrumentOrder(b.instrumentType))
        setInstrumentList(borrowInstruements)
    }, [route])

    return (
        <View style={{
            flexGrow: 1,
            backgroundColor: '#fff',
        }}>
            <ScrollView contentContainerStyle={{
                flexGrow: 1,
                backgroundColor: '#fff',
            }}>
                {instrumentList && <BorrowInstrumentsList instrumentList={instrumentList} />}
            </ScrollView>
        </View>
    )
}

export default ReservationInstrumentsViewScreen;