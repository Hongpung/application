import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import LongButton from '../../components/buttons/LongButton'
import { Color } from '../../ColorSet'
import { useReservation } from '../../context/ReservationContext'
import CheckboxComponent from '../../components/checkboxs/CheckboxComponent'

const ReservationConfirmScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const [isAgree, setAgree] = useState(false)

    const DateString = useCallback((selectedDate: Date) => {
        return `${selectedDate.getFullYear()}.${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getDate().toString().padStart(2, '0')}(${daysOfWeek[selectedDate.getDay()]})`;
    }, [])

    const { reservation } = useReservation();

    const ConfirmHandler = () => {
        /**
         * 여기에 fetch해서 전송
            const data=
                    {date: `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`
                     startTime : '14:00'
                     endTime: '16:30'
                     
            }
            
            const sendFormat = JSON.stringfy(data)
        */
        navigation.navigate('DailyReserveList', { date: reservation.date.toISOString() })
    };
    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ height: 88 }} />
            <Text style={{ textAlign: 'center', fontFamily: 'NanumSquareNeo-Bold', fontSize: 20, marginBottom: 34 }}>예약 정보 확인</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                <Text style={styles.leftText}>예약 일자</Text>
                <Text style={styles.rightText}>{DateString(reservation.date)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                <Text style={styles.leftText}>예약 시간</Text>
                <Text style={styles.rightText}>{(reservation.Time.startTime).toString().padStart(2, '0')}:00~{(reservation.Time.endTime).toString().padStart(2, '0')}:00</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                <Text style={styles.leftText}>예약자</Text>
                <Text style={styles.rightText}>{'홍길동'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                <Text style={styles.leftText}>예약명</Text>
                <Text style={styles.rightText}>{reservation.name || '정기연습'}</Text>
            </View>
            <View style={{ height: 16, backgroundColor: Color['grey100'], marginVertical: 10 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                <Text style={styles.leftText}>예약 유형</Text>
                <Text style={styles.rightText}>{reservation.isRegular ? '정기 연습' : '개인 연습'} ({reservation.isParticipatible ? '참여 가능' : '참여 불가'})</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                <Text style={styles.leftText}>참여자</Text>
                <Text style={styles.rightText}>
                    {reservation.participants.length > 0 ? `${reservation.participants.slice(0, 2).map(user => `${user.name} `)}${reservation.participants.length >= 3 && `외`}${reservation.participants.length} 명` : '없음'}
                </Text>
                {reservation.participants.length > 0 && <Pressable style={{ position: 'absolute', right: -16 }}><Text style={{
                    fontFamily: 'NanumSquareNeo-ExtarBold',
                    fontSize: 16,
                    color: Color['grey400']
                }}>{'>'}</Text></Pressable>}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                <Text style={styles.leftText}>대여악기</Text>
                <Text style={styles.rightText}>
                    {reservation.borrowInstruments.length > 0 ? ['쇠', '장구', '북', '소고', '새납'].map((type) => {
                        const instCount = reservation.borrowInstruments.filter((instrument) => instrument.type == type).length
                        if (instCount > 0)
                            return `${type} ${instCount}`
                    }) : '없음'}
                </Text>
                {reservation.borrowInstruments.length > 0 && <Pressable style={{ position: 'absolute', right: -16 }}><Text style={{
                    fontFamily: 'NanumSquareNeo-ExtarBold',
                    fontSize: 16,
                    color: Color['grey400']
                }}>{'>'}</Text></Pressable>}
            </View>
            <View style={{ position: 'absolute', bottom: 0, paddingVertical: 8, width: '100%' }}>
                <View style={{ marginHorizontal: 28, marginBottom: 12 }}>

                    <CheckboxComponent
                        innerText='작성된 정보가 일치합니다.'
                        onCheck={() => setAgree(!isAgree)}
                    ></CheckboxComponent>
                </View>
                <LongButton color='blue' innerText='확정하기' isAble={isAgree} onPress={ConfirmHandler} />
            </View>
        </View>
    )
}

export default ReservationConfirmScreen

const styles = StyleSheet.create({
    leftText: {
        fontFamily: 'NanumSquareNeo-Regular',
        fontSize: 16,
        color: Color['grey400']
    },
    rightText: {
        fontFamily: 'NanumSquareNeo-Bold',
        fontSize: 16,
        color: Color['grey700']
    }
})