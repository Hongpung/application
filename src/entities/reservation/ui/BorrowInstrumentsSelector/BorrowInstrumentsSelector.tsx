import { View, Text, Pressable, Dimensions } from "react-native"

import { Color, Icons } from "@hongpung/src/common";

import { instrumentTypeArray } from "@hongpung/src/entities/instrument/@x/reservation";


type BorrowInstrumentSelectorProps = {
    resetBorrowInstruments?: () => void
    borrowInstruments: any[]
    onPress: () => void
}

const { width } = Dimensions.get('window')

export const BorrowInstrumentsSelector: React.FC<BorrowInstrumentSelectorProps> = ({ onPress, resetBorrowInstruments, borrowInstruments }) => {

    return (
        <View>
            <View style={{ marginHorizontal: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>대여 악기</Text>
                    {resetBorrowInstruments &&
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
                            onPress={resetBorrowInstruments}>
                            <Icons name='refresh' size={16} color={Color['grey400']} />
                            <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey300'] }}>초기화</Text>
                        </Pressable>}
                </View>

                <View style={{ height: 16 }} />

                <Pressable style={{ marginHorizontal: 16 }}
                    onPress={onPress}>
                    {borrowInstruments.length > 0 ?
                        <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, height: 72, backgroundColor: Color['grey200'] }}>
                            <View style={{ flexDirection: 'row' }}>
                                {instrumentTypeArray.map((type) => {
                                    if ('징' === type) return null;
                                    if ('기타' === type) {
                                        const instCount = borrowInstruments.filter((instrument) => instrument.instrumentType == type || instrument.instrumentType == '징').length
                                        return (<View style={{ width: (width - 96) / 5, alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14 }}>{type}</Text>
                                            <View style={{ height: 8 }} />
                                            <Text style={instCount > 0 ? { fontFamily: 'NanumSquareNeo-Bold', fontSize: 20, color: Color['blue500'] } : { fontFamily: 'NanumSquareNeo-Bold', fontSize: 20, color: Color['grey300'] }}>{instCount > 0 ? instCount : '-'}</Text>
                                        </View>)
                                    }
                                    else {
                                        const instCount = borrowInstruments.filter((instrument) => instrument.instrumentType == type).length
                                        return (<View style={{ width: (width - 96) / 5, alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14 }}>{type}</Text>
                                            <View style={{ height: 8 }} />
                                            <Text style={instCount > 0 ? { fontFamily: 'NanumSquareNeo-Bold', fontSize: 20, color: Color['blue500'] } : { fontFamily: 'NanumSquareNeo-Bold', fontSize: 20, color: Color['grey300'] }}>{instCount > 0 ? instCount : '-'}</Text>
                                        </View>)
                                    }
                                })}
                            </View>
                        </View> :
                        <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 4, height: 72, borderColor: Color['grey200'], borderStyle: 'dashed' }}>
                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'] }}>+</Text></View>
                    }
                </Pressable>
            </View>
        </View>
    )
}