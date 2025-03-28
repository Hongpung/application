import { StyleSheet } from "react-native"

import { Color } from "@hongpung/src/common"

export const style = StyleSheet.create({
    creatorName: {
        fontSize: 16, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey700']
    },
    creatorNickname: {
        fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400']
    },
    footerText: {
        fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400']
    }
})