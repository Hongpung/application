import { Color } from "@hongpung/src/common"
import { View, Text, StyleSheet } from "react-native"

export const InstrumentTag: React.FC<{ borrowAvailable: boolean }> = ({ borrowAvailable }) => {
    return (
        <View style={[styles.tag, {
            backgroundColor: borrowAvailable ? Color['blue100'] : Color['red100']
        }]}>
            <Text style={[styles.tagText, { color: borrowAvailable ? Color['blue500'] : Color['red500'] }]}>
                {borrowAvailable ? '대여 가능' : '대여 불가'}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    
    tag: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingVertical: 3,
        borderRadius: 5,
        marginRight: 4,
    },
    tagText: {
        fontSize: 12,
        fontFamily: "NanumSquareNeo-Bold",
        lineHeight: 12,
        textAlignVertical: 'center'
    },
})