import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Color } from '../../../ColorSet'
import { Club, clubs, InstrumentType, instrumentTypes, User } from '../../../UserType'
import ProfileMiniCard from '../../../components/cards/ProfileMiniCard'
import { useReservation } from '../context/ReservationContext'
import LongButton from '../../../components/buttons/LongButton'
import Header from '../../../components/Header'
import { getToken } from '@hongpung/utils/TokenHandler'
import { Icons } from '@hongpung/components/Icon'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { InReservationStackParamList } from '@hongpung/nav/ReservationStack'
import { useNavigation } from '@react-navigation/native'


type ParticipantsSelectNavProps = NativeStackNavigationProp<InReservationStackParamList, 'ParticipantsSelect'>

const ParticipantsSelectScreen: React.FC = () => {

    const navigation = useNavigation<ParticipantsSelectNavProps>();
    const { reservation, setParticipants } = useReservation();

    const [prevUserPicked, setPrevUserPick] = useState<User[]>([])
    const [originList, setOrigin] = useState<User[]>([])
    const [fiteredUsers, fiterUser] = useState<User[]>([])

    const [descendingOrder, setDescendingOrder] = useState(true)
    const [club, setClub] = useState<Club | null>(null)

    const [userInstrumentType, setUserInstermentType] = useState<InstrumentType | null>(null)

    const [onSelect, setSelctFilter] = useState<`club` | 'instruement' | 'enrollmentNumber' | null>(null)

    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        // setPrevUserPick(reservation.participants);
        const load = async () => {
            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            try {
                setLoading(true);
                const token = await getToken('token');
                if (!token) throw Error('token is not valid')
                const response = await fetch(`${process.env.SUB_API}/member/invite-possible`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application',
                            'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
                        },
                        signal
                    }
                )
                const loadedUsers = await response.json() as User[];

                console.log(loadedUsers)
                setOrigin(loadedUsers);
                fiterUser(loadedUsers)
            } catch (e) {
                console.error(e);
                navigation.goBack();
            } finally {
                setLoading(false);
                clearTimeout(timeoutId);
            }

        }

        load();
    }, [])



    useEffect(() => {
        let newUsers = [...originList];

        // if (userInstrumentType && club) {
        //     newUsers = originList.filter(user => user.instrument === userInstrumentType && user.club === club);
        // } else if (userInstrumentType) {
        //     newUsers = originList.filter(user => user.instrument === userInstrumentType);
        // } else 
        if (club) {
            newUsers = originList.filter(user => user.club === club);
        }

        // if (descendingOrder) {
        //     newUsers.sort((a, b) => b.enrollmentNumber - a.enrollmentNumber);
        // } else {
        //     newUsers.sort((a, b) => a.enrollmentNumber - b.enrollmentNumber);
        // }

        fiterUser(newUsers);

    }, [club, userInstrumentType, descendingOrder, originList]);

    if (isLoading)
        return (
            <View style={{ backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <ActivityIndicator size={'large'} color={Color['blue500']}></ActivityIndicator>
            </View>
        )

    // if (originList.length == 0)
    //     return (
    //         )
    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Header leftButton='close' HeaderName='인원 선택' addLeftAction={() => setParticipants(prevUserPicked)} />
            {
                originList.length == 0 ?
                    <View style={{ backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Text style={{ marginHorizontal: 'auto',  fontFamily: 'NanumSquareNeo-Bold', fontSize: 18, color: Color['grey400'] }}>
                            함께 할 수 있는 인원이 없습니다.</Text>
                    </View> :
                    <>
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
                                <Pressable style={[fiterBar.box, { flexDirection: 'row', alignItems: 'center', gap: 2 }]}
                                    onPress={() => { setDescendingOrder(!descendingOrder); }}>
                                    <Text style={fiterBar.text}>학번순</Text>
                                    <Icons size={20} name={descendingOrder ? 'arrow-down' : 'arrow-up'} color={Color['blue400']} />
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
                                            renderItem={({ item }: { item: Club | null }) => {
                                                return (
                                                    <Pressable style={{ paddingVertical: 8, marginVertical: 4, width: 92, alignItems: 'flex-start', justifyContent: 'space-between' }}
                                                        onPress={() => { item ? setClub(item) : setClub(null); setSelctFilter(null) }}>
                                                        <Text style={{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, color: club == item ? Color['blue500'] : Color['grey400'] }}>{item ?? '전체'}</Text>
                                                    </Pressable>
                                                )
                                            }}
                                        />
                                    </View>}
                                </Pressable>
                                {/* <Pressable style={fiterBar.box}>
                        <Text style={fiterBar.text}>학번</Text>
                    </Pressable> */}
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
                                            data={[null, ...instrumentTypes]}
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

                        <View style={{ flex: 1, zIndex: 1, marginTop: onSelect ? -(200 - 12) : 12, position: 'relative' }}>
                            <FlatList
                                contentContainerStyle={{ marginHorizontal: 24, backgroundColor: '#FFF', zIndex: 1 }}
                                data={originList}
                                renderItem={({ item }: { item: User }) => {
                                    const isPicked = reservation.participators.some(participant =>
                                        JSON.stringify(participant) === JSON.stringify(item)
                                    )
                                    return (
                                        <ProfileMiniCard
                                            key={item.memberId}
                                            user={item} view={'inReserveView'}
                                            isPicked={isPicked}
                                            onPick={() => {
                                                if (!isPicked) setParticipants([...reservation.participators, item])
                                                else setParticipants(reservation.participators.filter((participant) => JSON.stringify(participant) != JSON.stringify(item)))
                                            }}

                                        ></ProfileMiniCard>)
                                }}
                                ItemSeparatorComponent={() => (<View style={{ height: 12 }} />)}
                            />
                        </View>

                        {reservation.participators.length > 0 && <View style={{ paddingTop: 12, width: '100%' }}>
                            <LongButton
                                color='blue'
                                isAble={true}
                                innerText={`선택완료 (${reservation.participators.length})`}
                                onPress={() => navigation.pop()}
                            />
                        </View>}
                    </>
            }

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