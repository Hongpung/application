import { ScrollView, View, Text } from "react-native"
import { useEffect, useState } from "react"
import { useIsFocused, useNavigation } from "@react-navigation/native"

import InstrumentCard from "@hongpung/components/cards/InstrumentCard"
import { briefInstrument, instrumentOrder } from "@hongpung/UserType"
import { Color } from "@hongpung/ColorSet"

import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import { ClubInstrumentStackParamList } from "@hongpung/nav/InstrumentStack"
import { ReservationStackParamList } from "@hongpung/nav/ReservationStack"

type InstrumentNavParams = NativeStackNavigationProp<ClubInstrumentStackParamList, 'InstrumentsHome'>

const BorrowInstrumentsList: React.FC<{ instrumentList: briefInstrument[] }> = ({ instrumentList }) => {

    const navigation = useNavigation<InstrumentNavParams>();

    const renderInstruments = () => {
        const rows = [];
        let cnt = instrumentOrder(instrumentList[0]?.type) - 1;
        for (let i = 0; i < instrumentList.length;) {
            let sliceCnt = 2;
            if (instrumentList[i].type != instrumentList[i + 1]?.type) sliceCnt = 1;
            const group = instrumentList.slice(i, i + sliceCnt);
            if (cnt < instrumentOrder(group[0].type)) {
                rows.push(
                    <View key={group[0].type + 'header'} style={{ marginTop: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 24, height: 24, backgroundColor: Color['grey400'] }} />
                        <Text style={{ fontSize: 18, color: Color['grey400'], marginLeft: 8 }}>
                            {group[0].type}
                        </Text>
                    </View>
                )
                cnt++;
            }

            rows.push(
                <View key={i} style={{ height: 168, width: 324, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4, }}>
                    {group.map((instrument, index) => (
                        <InstrumentCard
                            key={instrument.name + index}
                            instrument={instrument}
                            view="inManage"
                            onSelectInstrument={(instrument) => { navigation.navigate('InstrumentSpecific', { instrumentId: instrument.instrumentId }); }}
                        />
                    ))}
                    {group.length % 2 == 1 && <View style={{ height: 168, width: 154 }} />}
                </View>
            );
            i += sliceCnt;
        }
        return rows;
    };

    return (
        <View style={{ flex: 1 }}>
            {instrumentList && renderInstruments()}
        </View>
    )
}

type ReservationInstrumentsViewProps = NativeStackScreenProps<ReservationStackParamList, 'ReservationInstrumentsView'>

const ReservationInstrumentsViewScreen: React.FC<ReservationInstrumentsViewProps> = ({ navigation, route }) => {

    const [instrumentList, setInstrumentList] = useState<briefInstrument[]>([])

    useEffect(() => {
        const { instruments } = route.params
        const borrowInstruements = instruments ? JSON.parse(instruments) as briefInstrument[] : [];
        console.log(borrowInstruements);
        borrowInstruements?.sort((a, b) => instrumentOrder(a.type) - instrumentOrder(b.type))
        setInstrumentList(borrowInstruements)
    }, [route])

    return (
        <View style={{
            flexGrow: 1,
            backgroundColor: '#fff',
        }}>
            <ScrollView contentContainerStyle={{
                flexGrow: 1,
                alignItems: 'center',
                backgroundColor: '#fff',
            }}>
                {instrumentList && <BorrowInstrumentsList instrumentList={instrumentList} />}
            </ScrollView>
        </View>
    )
}

export default ReservationInstrumentsViewScreen;