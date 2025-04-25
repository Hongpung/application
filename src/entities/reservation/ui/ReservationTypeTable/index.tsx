import { Color } from "@hongpung/src/common"
import { View, Text } from "react-native"

const ReservationTypeTable: React.FC = () => {
    return (
        <View style={{ flexDirection: 'column', gap: 4 }}>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <View style={{ backgroundColor: Color['blue500'], height: 4, width: 20, borderRadius: 5, marginRight: 8 }} />

                <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>정규 일정</Text>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <View style={{ backgroundColor: Color['red500'], height: 4, width: 20, borderRadius: 5, marginRight: 8 }} />

                <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>참여 불가</Text>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <View style={{ backgroundColor: Color['green500'], height: 4, width: 20, borderRadius: 5, marginRight: 8 }} />

                <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>참여 가능</Text>

            </View>

        </View>
    )
}

export default ReservationTypeTable