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
            <View>
                <Text style={styles.greetingText}>홍길동님 안녕하세요</Text>
                <Text style={styles.dateText}>2024년 7월 7일</Text>
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
        paddingHorizontal:24,
        marginTop:12
    },iconContainer:{
        flexDirection: 'row',
        height: 30,
        width: 72,
        justifyContent:'space-between'
    },
    icons: {
        width: 32,
        height: 32,
        backgroundColor: Color['grey400']
    },
    greetingText: {
        position: 'relative',
        top: 115,
        left: 184,
        width: 180,
        textAlign: 'right',
        color: '#0E0E0E',
        fontSize: 20,
        fontFamily: 'NanumSquare Neo OTF',
        fontWeight: '700',
        lineHeight: 20,
    },
    dateText: {
        position: 'relative',
        top: 119,
        left: 36,
        color: '#0E0E0E',
        fontSize: 14,
        fontFamily: 'NanumSquare Neo OTF',
        fontWeight: '700',
        lineHeight: 16,
        height:24,
    },
});

export default ExampleScreen;
