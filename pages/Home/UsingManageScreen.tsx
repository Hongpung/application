import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Color } from '../../ColorSet'
import ProfileMiniCard from '../../components/cards/ProfileMiniCard'
import { UserProvider } from '../../context/UserContext'
import { User } from '../../UserType'
import LongButton from '../../components/buttons/LongButton'

const UsingManageScreen:React.FC<{navigation:any}> = ({navigation}) => {

    const users: User[] = [
        {
            name: "홍길동",
            nickname: "길동이",
            club: "들녘",
            instrument: "쇠",
            grade: 3,
            isCapt: true,
            addRole: "상쇠",
            badge: "https://example.com/badge1.png"
        },
        {
            name: "이영희",
            club: "산틀",
            instrument: "장구",
            grade: 2,
        },
        {
            name: "김철수",
            nickname: "철이",
            club: "신명화랑",
            instrument: "북",
            grade: 13,
            isCapt: false,
            badge: "https://example.com/badge2.png"
        },
        {
            name: "박민수",
            club: "악반",
            instrument: "소고",
            grade: 1,
            addRole: "수법고",
            badge: "https://example.com/badge3.png"
        },
        {
            name: "최지우",
            nickname: "지우",
            club: "들녘",
            instrument: "새납",
            grade: 5,
        },
        {
            name: "한가영",
            club: "산틀",
            instrument: "쇠",
            grade: 14,
            isCapt: true,
            addRole: "상쇠",
        },
        {
            name: "이정수",
            nickname: "정수",
            club: "신명화랑",
            instrument: "장구",
            grade: 9,
            isCapt: false,
        },
        {
            name: "김민호",
            nickname: "민호",
            club: "악반",
            instrument: "북",
            grade: 12,
            addRole: "수북",
            badge: "https://example.com/badge4.png"
        },
        {
            name: "박수현",
            club: "들녘",
            instrument: "소고",
            grade: 7,
        },
        {
            name: "이하나",
            nickname: "하나",
            club: "산틀",
            instrument: "새납",
            grade: 15,
            isCapt: true,
            addRole: "상장구",
        }
    ];
    
    const [canExtand,setExtendPossible] = useState(true);
    const [canReturn,setcanReturnPossible] = useState(false);


    return (
        <UserProvider>
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <ScrollView style={{ flex: 1, backgroundColor: '#FFF' }} showsVerticalScrollIndicator={false}>
                    <View style={{ height: 16 }} />
                    <Text style={{ marginHorizontal: 28, fontFamily: 'NanumSquareNeo-Bold', fontSize: 18 }}>
                        연습 예정 시간
                    </Text>
                    <View style={{ height: 20 }} />
                    <View style={{ flexDirection: 'row', width: 176, alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ width: 36, height: 36, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 32, height: 32, borderRadius: 100, borderWidth: 1, borderColor: Color['grey400'] }} />
                        </View>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 20 }}>17:00~19:00</Text>
                    </View>

                    <View style={{ height: 24 }} />
                    <Text style={{ marginHorizontal: 28, fontFamily: 'NanumSquareNeo-Bold', fontSize: 18 }}>
                        아직 안 온 사람
                    </Text>

                    <View style={{ height: 16 }} />

                    <View style={{ marginHorizontal: 24 }}>
                            {users.map((member) => (
                                <View  key={member.name+'container'} style={{ marginVertical: 4 }}>
                                    <ProfileMiniCard key={member.name} user={member} isPicked={false} view={'inReserveView'} />
                                </View>
                            ))}
                    </View>
                </ScrollView>
                <View>

                <View style={{height:8}}/>
                    {(!canExtand)&&<Text style={{alignSelf:'center', color:Color['red700'], fontSize:14, fontFamily:'NanumSquareNeo-Bold'}}>연장은 종료 30분 이전까지만 가능해요</Text>}
                    {(!canReturn)&&<Text style={{alignSelf:'center', color:Color['red700'], fontSize:14, fontFamily:'NanumSquareNeo-Bold'}}>종료는 30분 이상 이용 후 가능해요</Text>}
                    <View style={{height:8}}/>
                    <LongButton color='green' innerText='연장하기' isAble={canExtand} onPress={()=>{navigation.goBack()}}/>
                    <View style={{height:8}}/>
                    <LongButton color='red' innerText='종료하기' isAble={canReturn} onPress={()=>{navigation.goBack()}}/>
                </View>
            </View>
        </UserProvider>
    )
}

export default UsingManageScreen

const styles = StyleSheet.create({})