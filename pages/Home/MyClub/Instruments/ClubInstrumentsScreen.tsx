import { ScrollView, View, Text } from "react-native"
import { useEffect, useState } from "react"
import { useIsFocused, useNavigation } from "@react-navigation/native"

import InstrumentCard from "@hongpung/components/cards/InstrumentCard"
import { InstrumentWithOutBorrowHistory, instrumentOrder } from "@hongpung/UserType"
import { Color } from "@hongpung/ColorSet"
import useFetchUsingToken from "@hongpung/src/common/hooks/useFetchUsingToken"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ClubInstrumentStackParamList } from "@hongpung/nav/InstrumentStack"

type InstrumentNavParams = NativeStackNavigationProp<ClubInstrumentStackParamList, 'InstrumentsHome'>

const InstrumentsList: React.FC<{ instrumentsList: InstrumentWithOutBorrowHistory[] }> = ({ instrumentsList }) => {

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

        instrumentsList.forEach((instrument) => {
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
                                                view="inManage"
                                                onClickInstrument={(instrument) => { navigation.navigate('InstrumentSpecific', { instrumentId: instrument.instrumentId }); }}
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

const ClubInstrumentsScreen: React.FC = () => {

    const isFocusing = useIsFocused();

    const { data: instruments, loading, error } = useFetchUsingToken<InstrumentWithOutBorrowHistory[]>(
        `${process.env.EXPO_PUBLIC_BASE_URL}/club/my-club/instruments`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }, 2000, [isFocusing]
    )

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff',
        }}>
            <ScrollView contentContainerStyle={{
                backgroundColor: '#fff',
            }}
                bounces={false}
            >
                {instruments && <InstrumentsList instrumentsList={instruments} />}
            </ScrollView>
        </View>
    )
}

export default ClubInstrumentsScreen;