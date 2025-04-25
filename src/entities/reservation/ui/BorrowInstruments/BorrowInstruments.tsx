import { View, Text, Dimensions } from "react-native"

import { Color } from "@hongpung/src/common";

import { instrumentTypes } from "@hongpung/src/entities/instrument/@x/reservation";

type BorrowInstrumentsViewerProps = {
    borrowInstruments: any[]
}

const { width } = Dimensions.get('window')

export const BorrowInstrumentsViewer: React.FC<BorrowInstrumentsViewerProps> = (props) => {

    const { borrowInstruments } = props;

    return (
        <View style={{ marginHorizontal: 16 }}>
            {borrowInstruments.length > 0 ?
                <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, height: 72, backgroundColor: Color['grey200'] }}>
                    <View style={{ flexDirection: 'row' }}>
                        {instrumentTypes.map((type) => {
                            if ('징' === type) return null;
                            if ('기타' === type) {
                                const instCount = borrowInstruments.filter((instrument) => instrument.instrumentType == type || instrument.instrumentType == '징').length
                                return (
                                    <View style={{ width: (width - 96) / 5, alignItems: 'center' }}>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14 }}>{type}</Text>
                                        <View style={{ height: 8 }} />
                                        <Text style={instCount > 0 ? { fontFamily: 'NanumSquareNeo-Bold', fontSize: 20, color: Color['blue500'] } : { fontFamily: 'NanumSquareNeo-Bold', fontSize: 20, color: Color['grey300'] }}>{instCount > 0 ? instCount : '-'}</Text>
                                    </View>
                                )
                            }
                            else {
                                const instCount = borrowInstruments.filter((instrument) => instrument.instrumentType == type).length
                                return (
                                    <View style={{ width: (width - 96) / 5, alignItems: 'center' }}>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14 }}>{type}</Text>
                                        <View style={{ height: 8 }} />
                                        <Text style={instCount > 0 ? { fontFamily: 'NanumSquareNeo-Bold', fontSize: 20, color: Color['blue500'] } : { fontFamily: 'NanumSquareNeo-Bold', fontSize: 20, color: Color['grey300'] }}>{instCount > 0 ? instCount : '-'}</Text>
                                    </View>
                                )
                            }
                        })}
                    </View>
                </View> :
                <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 4, height: 72, borderColor: Color['grey200'], borderStyle: 'dashed' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'] }}>대여한 악기가 없습니다.</Text>
                </View>
            }
        </View>
    )
}