import { ScrollView, View, Text } from "react-native"
import { useEffect, useState } from "react"
import { useIsFocused, useNavigation } from "@react-navigation/native"

import InstrumentCard from "@hongpung/components/cards/InstrumentCard"
import { InstrumentWithOutBorrowHistory, instrumentOrder } from "@hongpung/UserType"
import { Color } from "@hongpung/ColorSet"
import useFetchUsingToken from "@hongpung/hoc/useFetchUsingToken"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ClubInstrumentStackParamList } from "@hongpung/nav/InstrumentStack"

type InstrumentNavParams = NativeStackNavigationProp<ClubInstrumentStackParamList, 'InstrumentsHome'>

const InstrumentsList: React.FC<{ instrumentsList: InstrumentWithOutBorrowHistory[] }> = ({ instrumentsList }) => {

    const navigation = useNavigation<InstrumentNavParams>();

    const renderInstruments = () => {
        const rows = [];
        let cnt = instrumentOrder(instrumentsList[0]?.instrumentType) - 1;
        for (let i = 0; i < instrumentsList.length;) {
            let sliceCnt = 2;
            if (instrumentsList[i].instrumentType != instrumentsList[i + 1]?.instrumentType) sliceCnt = 1;
            const group = instrumentsList.slice(i, i + sliceCnt);
            if (cnt < instrumentOrder(group[0].instrumentType)) {
                rows.push(
                    <View key={group[0].instrumentType + 'header' + i} style={{ marginTop: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 24, height: 24, backgroundColor: Color['grey400'] }} />
                        <Text style={{ fontSize: 18, color: Color['grey400'], marginLeft: 8 }}>
                            {group[0].instrumentType}
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
                            onClickInstrument={(instrument) => { navigation.navigate('InstrumentSpecific', { instrumentId: instrument.instrumentId }); }}
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
            {renderInstruments()}
        </View>
    )
}

const ClubInstrumentsScreen: React.FC = () => {

    const isFocusing = useIsFocused();
    const [instruments, setInstruments] = useState<InstrumentWithOutBorrowHistory[]>([])

    const { data, loading, error } = useFetchUsingToken<InstrumentWithOutBorrowHistory[]>(
        `${process.env.SUB_API}/club/my-club/instruments`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }, 2000, [isFocusing]
    )

    useEffect(() => {
        const clubInstruements = data ?? [];
        console.log(data);
        clubInstruements?.sort((a, b) => instrumentOrder(a.instrumentType) - instrumentOrder(b.instrumentType))
        setInstruments(clubInstruements ?? [])
    }, [data])

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
                {instruments && <InstrumentsList instrumentsList={instruments} />}
            </ScrollView>
        </View>
    )
}

export default ClubInstrumentsScreen;