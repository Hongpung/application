import { ScrollView, View, Text } from "react-native"
import { briefInstrument, instrumentOrder } from "@hongpung/UserType"
import { HomeStackParamList } from "@hongpung/pageTypes"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import InstrumentCard from "@hongpung/components/cards/InstrumentCard"
import { Color } from "@hongpung/ColorSet"
import { useInstrument } from "@hongpung/context/InstrumentContext"
import { useEffect, useState } from "react"
import useFetchUsingToken from "@hongpung/hoc/useFetchUsingToken"
import { useIsFocused } from "@react-navigation/native"


type ClubInstrumentsScreenProps = NativeStackScreenProps<HomeStackParamList, 'InstrumentsHome'>

const InstrumentsList: React.FC<{ instrumentsList: briefInstrument[], navigation: any }> = ({ instrumentsList, navigation }) => {
    const renderInstruments = () => {
        const rows = [];
        let cnt = instrumentOrder(instrumentsList[0]?.type) - 1;
        for (let i = 0; i < instrumentsList.length;) {
            let sliceCnt = 2;
            if (instrumentsList[i].type != instrumentsList[i + 1]?.type) sliceCnt = 1;
            const group = instrumentsList.slice(i, i + sliceCnt);
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
                            onSelectInstrument={(instrument) => { navigation.push('InstrumentSpecific', { instrumentId: instrument.instrumentId }); }}
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
            {instrumentsList && renderInstruments()}
        </View>
    )
}

const ClubInstrumentsScreen: React.FC<ClubInstrumentsScreenProps> = ({ navigation }) => {

    const isFocusing = useIsFocused();
    const [instruments, setInstruments] = useState<briefInstrument[]>([])

    const { data, loading, error } = useFetchUsingToken<briefInstrument[]>(
        `${process.env.BASE_URL}/instrument/list`,
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
        clubInstruements?.sort((a, b) => instrumentOrder(a.type) - instrumentOrder(b.type))
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
                {instruments && <InstrumentsList instrumentsList={instruments} navigation={navigation} />}
            </ScrollView>
        </View>
    )
}

export default ClubInstrumentsScreen;