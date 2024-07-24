import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Color } from '../../ColorSet';

const ExampleScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.iconsRow}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icons}>Bell</Text>
                    <Text style={styles.icons}>Profile</Text>
                </View>

            </View>
            <View style={styles.textRow}>
                <Text style={styles.dateText}>2024년 7월 7일</Text>
                <Text style={styles.greetingText}>홍길동님 안녕하세요</Text>
            </View>
            <View>
                <Text style={styles.ScheduleOfDate}>
                    오늘의 일정이 없어요
                </Text>
            </View>
            <View style={styles.Advertisebanner}>
                {/* 배너 확인 */}
            </View>
            <View style={{ marginHorizontal: 24, marginTop: 32, }}>
                <Text style={{
                    fontSize: 18,
                    fontFamily: 'NanumSquareNeo-Bold',
                    marginLeft:8,
                    marginBottom:16
                }}>
                    우리 동아리
                </Text>
                <View style={{height:120, backgroundColor:Color['grey300'],borderRadius:10}}>
                </View>
            </View>
            <View style={{ marginHorizontal: 24, marginTop: 32, }}>
                <Text style={{
                    fontSize: 18,
                    fontFamily: 'NanumSquareNeo-Bold',
                    marginLeft:8,
                    marginBottom:16
                }}>
                    우리 동아리
                </Text>
                <View style={{height:120, backgroundColor:Color['grey300'],borderRadius:10}}>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 390,
        height: 7000,
        position: 'relative',
        backgroundColor: 'white',
        overflow: 'scroll',
    },
    iconsRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        height: 30,
        paddingHorizontal: 24,
        marginTop: 8
    },
    iconContainer: {
        flexDirection: 'row',
        height: 30,
        width: 72,
        justifyContent: 'space-between'
    },
    icons: {
        width: 32,
        height: 32,
        backgroundColor: Color['grey400']
    },
    textRow: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 24,
        marginTop: 24
    },
    greetingText: {
        position: 'relative',
        textAlign: 'right',
        color: '#0E0E0E',
        fontSize: 20,
        fontFamily: 'NanumSquareNeo-Bold'
    },
    dateText: {
        position: 'relative',
        color: '#0E0E0E',
        fontSize: 14,
        fontFamily: 'NanumSquareNeo-Regular',
        lineHeight: 16,
    },
    ScheduleOfDate: {
        marginHorizontal: 24,
        height: 160,
        borderWidth: 2,
        borderRadius: 10,
        marginTop: 12
    },
    Advertisebanner: {
        marginTop: 28,
        marginHorizontal: 24,
        height: 150,
        borderRadius: 10,
        backgroundColor: Color['blue500']
    }
});

export default ExampleScreen;
