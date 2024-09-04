import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Color } from '../../ColorSet'
import { club, clubs, InstrumentType, InstrumentTypes, User } from '../../UserType'
import ProfileMiniCard from '../../components/cards/ProfileMiniCard'
import { useReservation } from '../../context/ReservationContext'
import LongButton from '../../components/buttons/LongButton'
import Header from '../../components/Header'

const originUsers: User[] = [{
    name: "홍길동",
    nickname: '길동색시',
    badge: "https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/042/307/533/42307533_1683708946356_31_600x600.JPG",
    club: "산틀",
    grade: 18,
    instrument: '소고',
    isCapt: true
}, {
    name: "임꺽정",
    badge: "https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/042/307/533/42307533_1683708946356_31_600x600.JPG",
    club: "산틀",
    grade: 11,
    instrument: "장구",
    isCapt: false,
    addRole: '상장구'
}, {
    name: "북꺽정",
    badge: "https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/042/307/533/42307533_1683708946356_31_600x600.JPG",
    club: "산틀",
    grade: 13,
    instrument: '북',
    isCapt: false,
    addRole: '수북'
}, {
    name: "임꺽정",
    club: "산틀",
    grade: 12,
    instrument: '쇠',
    addRole: '상쇠'
}
]

const ParticipantsSelectScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

    const [originList, setOrigin] = useState<User[]>([])
    const [fiteredUsers, fiterUser] = useState<User[]>([])
    const [descendingOrder, setDescendingOrder] = useState(true)
    const [club, setClub] = useState<club | null>(null)
    const [userInstrumentType, setUserInstermentType] = useState<InstrumentType | null>(null)
    const [onSelect, setSelctFilter] = useState<`club` | 'instruement' | 'grade' | null>(null)
    const { reservation, setParticipants } = useReservation();

    useEffect(() => {
        setOrigin(reservation.participants);
        
    }, [])

    useEffect(() => {
        let newUsers = [...originUsers];

        if (userInstrumentType && club) {
            newUsers = originUsers.filter(user => user.instrument === userInstrumentType && user.club === club);
        } else if (userInstrumentType) {
            newUsers = originUsers.filter(user => user.instrument === userInstrumentType);
        } else if (club) {
            newUsers = originUsers.filter(user => user.club === club);
        }

        if (descendingOrder) {
            newUsers.sort((a, b) => b.grade - a.grade);
        } else {
            newUsers.sort((a, b) => a.grade - b.grade);
        }

        fiterUser(newUsers);

    }, [club, userInstrumentType, descendingOrder, originUsers]);

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Header leftButton='X' HeaderName='인원 선택' addLeftAction={() => setParticipants(originList)} />
            {onSelect && (
                <Pressable
                    style={{ position: 'absolute', zIndex: 2, width: '100%', height: '100%' }}
                    onPress={() => { setSelctFilter(null); }}>
                    <View />
                </Pressable>
            )}
            <View style={{ zIndex: 5, position: 'relative' }}>
                <ScrollView horizontal contentContainerStyle={{ height: onSelect ? 232 : 32, marginTop: 8, marginHorizontal: 24, alignItems: 'flex-start', }}>
                    {onSelect && (
                        <Pressable
                            style={{ position: 'absolute', zIndex: 2, width: '100%', height: 36 }}
                            onPress={() => { setSelctFilter(null); }}>
                            <View />
                        </Pressable>
                    )}
                    {onSelect && (
                        <Pressable
                            style={{ position: 'absolute', zIndex: 0, width: '100%', height: '100%' }}
                            onPress={() => { setSelctFilter(null); }}>
                            <View />
                        </Pressable>
                    )}
                    <Pressable style={[fiterBar.box, { flexDirection: 'row', alignItems: 'center' }]}
                        onPress={() => {setDescendingOrder(!descendingOrder); }}>
                        <Text style={fiterBar.text}>학번순</Text>
                        <View style={{ width: 24, height: 24, backgroundColor: descendingOrder ? Color['blue300'] : Color['grey300'], alignSelf: 'center' }} />
                    </Pressable>
                    <Pressable style={[fiterBar.box, club && { backgroundColor: Color['blue100'], borderColor: Color['blue500'] }]}
                        onPress={() => { setSelctFilter('club') }}>
                        <Text style={[fiterBar.text, club && { color: Color['blue500'] }]}>동아리{club && `:${club}`}</Text>
                        {onSelect == 'club' && <View style={{
                            position: 'absolute', top: 34, zIndex: 5, width: 108, backgroundColor: '#FFF', alignItems: 'flex-start', paddingHorizontal: 8, borderRadius: 5, shadowColor: Color['grey700'],
                            shadowOffset: { width: -2, height: 2 }, // 그림자 오프셋 (x, y)
                            shadowOpacity: 0.1,         // 그림자 투명도 (0에서 1)
                            shadowRadius: 5,          // 그림자 반경
                            elevation: 5,
                            maxHeight: 160,
                        }}>
                            <FlatList
                                contentContainerStyle={{ alignItems: 'flex-start' }}
                                showsVerticalScrollIndicator={false}
                                data={[null, ...clubs]}
                                renderItem={({ item }: { item: club | null }) => {
                                    return (
                                        <Pressable style={{ paddingVertical: 8, marginVertical: 4, width: 92, alignItems: 'flex-start', justifyContent: 'space-between' }}
                                            onPress={() => { item ? setClub(item) : setClub(null); setSelctFilter(null) }}>
                                            <Text style={{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, color: club == item ? Color['blue500'] : Color['grey400'] }}>{item ?? '전체'}</Text>
                                        </Pressable>
                                    )
                                }}
                            />
                        </View>}</Pressable>
                    <Pressable style={fiterBar.box}><Text style={fiterBar.text}>학번</Text></Pressable>
                    <Pressable style={[fiterBar.box, userInstrumentType && { backgroundColor: Color['blue100'], borderColor: Color['blue500'] }]}
                        onPress={() => { setSelctFilter('instruement') }}
                    >
                        <Text style={[fiterBar.text, userInstrumentType && { color: Color['blue500'] }]}>악기{userInstrumentType && `:${userInstrumentType}`}</Text>
                        {onSelect == 'instruement' && <View style={{
                            position: 'absolute', top: 34, zIndex: 5, width: 80, backgroundColor: '#FFF', alignItems: 'flex-start', paddingHorizontal: 8, borderRadius: 5, shadowColor: Color['grey700'],
                            shadowOffset: { width: -2, height: 2 }, // 그림자 오프셋 (x, y)
                            shadowOpacity: 0.1,         // 그림자 투명도 (0에서 1)
                            shadowRadius: 5,          // 그림자 반경
                            elevation: 5,
                            height: 180,
                        }}>
                            <FlatList
                                contentContainerStyle={{ alignItems: 'flex-start' }}
                                showsVerticalScrollIndicator={false}
                                data={[null, ...InstrumentTypes]}
                                renderItem={({ item }: { item: InstrumentType | null }) => {
                                    return (
                                        <Pressable style={{ paddingVertical: 8, marginVertical: 4, width: 64, alignItems: 'flex-start', justifyContent: 'space-between' }}
                                            onPress={() => { item ? setUserInstermentType(item) : setUserInstermentType(null); setSelctFilter(null) }}>
                                            <Text style={{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, color: userInstrumentType == item ? Color['blue500'] : Color['grey400'] }}>{item ?? '전체'}</Text>
                                        </Pressable>
                                    )
                                }}
                            />
                        </View>}
                    </Pressable>
                </ScrollView>
            </View>

            <View style={{ flex: 1, marginHorizontal: 24, zIndex: -1, marginTop: onSelect ? -(200 - 12) : 12, position: 'relative' }}>
                <FlatList
                    contentContainerStyle={{ top: 0, backgroundColor: '#FFF', zIndex: -1 }}
                    data={fiteredUsers}
                    renderItem={({ item }: { item: User }) => {
                        const isPicked = reservation.participants.some(participant =>
                            JSON.stringify(participant) === JSON.stringify(item)
                        )
                        return (<ProfileMiniCard user={item} view={'inReserveView'}
                            isPicked={isPicked}
                            onPick={() => {
                                if (!isPicked) setParticipants([...reservation.participants, item])
                                else setParticipants(reservation.participants.filter((participant) => JSON.stringify(participant) != JSON.stringify(item)))
                            }}

                        ></ProfileMiniCard>)
                    }}
                    ItemSeparatorComponent={() => (<View style={{ height: 12 }} />)}
                />
            </View>

            {reservation.participants.length > 0 && <View style={{ paddingTop: 12, width: '100%' }}>
                <LongButton
                    color='blue'
                    isAble={true}
                    innerText={`선택완료 (${reservation.participants.length})`}
                    onPress={() => navigation.pop()}
                />
            </View>}
        </View>
    )
}

export default ParticipantsSelectScreen

const fiterBar = StyleSheet.create({
    box: {
        height: 32,
        paddingHorizontal: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Color['grey200'],
        justifyContent: 'center',
        marginHorizontal: 4,
        zIndex: 0,
        backgroundColor: '#FFF'
    },
    text: {
        fontFamily: 'NanumSquareNeo-Regular',
        fontSize: 14,
    }
})