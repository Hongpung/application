import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color } from '../../ColorSet';

const { width } = Dimensions.get(`window`)

const DailyReserveListScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {

    const { date } = route.params;
    const seletedDate = new Date(date)

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <View style={{ height: 60, marginHorizontal: 24, width: width - 64, alignItems: 'center' }}>
                <View style={{ height: 4 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 264 }}>
                    <Text style={styles.DayText}>월</Text>
                    <Text style={styles.DayText}>화</Text>
                    <Text style={styles.DayText}>수</Text>
                    <Text style={styles.DayText}>목</Text>
                    <Text style={styles.DayText}>금</Text>
                    <Text style={styles.DayText}>토</Text>
                    <Text style={styles.DayText}>일</Text>
                </View>
                <View style={{ height: 4 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ height: 32, width: 32, backgroundColor: Color['grey200'] }} />
                    <View style={{ height: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 264, marginHorizontal: 8 }}>
                        <Text style={[styles.Date, seletedDate.getDate() == 2 && { backgroundColor: Color['blue100'] }]}>1</Text>
                        <Text style={[styles.Date, seletedDate.getDate() == 2 && { backgroundColor: Color['blue100'] }]}>2</Text>
                        <Text style={[styles.Date, seletedDate.getDate() == 2 && { backgroundColor: Color['blue100'] }]}>3</Text>
                        <Text style={[styles.Date, seletedDate.getDate() == 2 && { backgroundColor: Color['blue100'] }]}>4</Text>
                        <Text style={[styles.Date, seletedDate.getDate() == 2 && { backgroundColor: Color['blue100'] }]}>5</Text>
                        <Text style={[styles.Date, seletedDate.getDate() == 2 && { backgroundColor: Color['blue100'] }]}>6</Text>
                        <Text style={[styles.Date, seletedDate.getDate() == 2 && { backgroundColor: Color['blue100'] }]}>7</Text>
                    </View>
                    <View style={{ height: 32, width: 32, backgroundColor: Color['grey200'] }} />
                </View>
            </View>
            <ScrollView contentContainerStyle={{backgroundColor:'#FFF', flex:1}}>
                <View style={{height:18, marginHorizontal:24, flexDirection:'row'}}>
                    <View style={{height:0.5, backgroundColor:Color['grey300'],}}></View>
                </View>
            </ScrollView>
            <Text>{seletedDate.getFullYear()}/{seletedDate.getMonth() + 1 < 10 ? '0' + (seletedDate.getMonth() + 1) : (seletedDate.getMonth() + 1)}/{seletedDate.getDate()}</Text>
        </View>
    )
}

export default DailyReserveListScreen

const styles = StyleSheet.create({
    DayText: {
        width: 28,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'NanumSquareNeo-Bold',
        color: Color['grey500'],
    },
    Date: {
        width: 28,
        height: 28,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
        fontFamily: 'NanumSquareNeo-Bold',
        borderRadius: 5,
        color: Color['grey500'],
    },
})