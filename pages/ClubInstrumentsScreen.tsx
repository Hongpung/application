import { ScrollView, View, Text } from "react-native"
import { Instrument, instrumentOrder } from "../UserType"
import { HomeStackParamList } from "./pageTypes"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import InstrumentCard from "../components/cards/InstrumentCard"
import { Color } from "../ColorSet"


type ClubInstrumentsScreenProps = NativeStackScreenProps<HomeStackParamList, 'ClubInstruments'>

const InstrumentsList: React.FC<{ instrumentsList: Instrument[], navigation: any }> = ({ instrumentsList, navigation }) => {

    const renderInstruments = () => {
        const rows = [];
        let cnt = instrumentOrder(instrumentsList[0].type) - 1;
        for (let i = 0; i < instrumentsList.length;) {
            let sliceCnt = 2;
            if (instrumentsList[i].type != instrumentsList[i + 1]?.type) sliceCnt = 1;
            const group = instrumentsList.slice(i, i + sliceCnt);
            if (cnt < instrumentOrder(group[0].type)) {
                rows.push(
                    <View key={group[0].type+'header'}style={{ marginTop: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
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
                            navigation={navigation}
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
        <View>
            {renderInstruments()}
        </View>
    )
}

const ClubInstrumentsScreen: React.FC<ClubInstrumentsScreenProps> = ({ navigation }) => {

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
        type: '장구',
        club: '들녘',
        nickname: '바보',
        owner: '홍길동'
    }
    ]

    instruments.sort((a, b) => instrumentOrder(a.type) - instrumentOrder(b.type))

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