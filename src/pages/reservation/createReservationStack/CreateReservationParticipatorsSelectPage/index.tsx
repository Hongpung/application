import { ActivityIndicator, FlatList, Keyboard, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { Color } from '@src/common'

import ProfileMiniCard from '../../../components/cards/ProfileMiniCard'

import { LongButton } from '@src/common/ui/buttons'
import Header from '@src/common/ui/header/Header'
import { Icons } from '@hongpung/src/common/ui/icons/Icons'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { InReservationStackParamList } from '@hongpung/nav/ReservationStack'
import { useNavigation } from '@react-navigation/native'
import { ShortButton } from '@hongpung/src/common/ui/buttons'
import useFetchUsingToken from '@hongpung/src/common/hooks/useFetchUsingToken'
import { debounce } from 'lodash'
import { useCreateReservation } from '@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context'
import UserPickerCard from '@hongpung/src/features/user/inviteReservation/ui/PickUserCard'
import { User } from '@hongpung/src/entities/user'


type ParticipantsSelectNavProps = NativeStackNavigationProp<InReservationStackParamList, 'ParticipantsSelect'>

const ParticipantsSelectScreen: React.FC = () => {

    const MaxEnrollmentNumber = useMemo<number>(() => {
        const currentYear = new Date().getFullYear().toString()
        return Number(currentYear.slice(-2))
    }, []);

    const searchInputRef = useRef<TextInput | null>(null)

    const navigation = useNavigation<ParticipantsSelectNavProps>();
    const { reservation, setParticipators } = useCreateReservation();

    const [newParticipators, setNewParticipators] = useState<User[]>([])

    const [findOptions, setFindOptions] = useState<{ club: Club[], enrollmentNumberRange: { startNumber?: string, endNumber?: string }, username: string }>({ username: '', club: [], enrollmentNumberRange: {} })

    const [optionsSelectState, setOptionSelectState] = useState(false)
    const [searchBarVisible, setSearchBarVisible] = useState(false)

    // const [originList, setOrigin] = useState<User[]>([])
    const [fiteredUsers, fiterUser] = useState<User[]>([])

    const [descendingOrder, setDescendingOrder] = useState(true)
    const [selectedClubs, setClubsOption] = useState<Club[]>([])
    const [selectedEnrollmentNumberRange, setEnrollmentNumberRange] = useState<{ startNumber?: string, endNumber?: string }>({})


    // const [onSelect, setSelctFilter] = useState<`club` | 'instruement' | 'enrollmentNumber' | null>(null)


    const parsedUrl = useMemo<string>(() => {
        const queryParams = new URLSearchParams();

        if (findOptions.username.length > 0) {
            queryParams.append('username', findOptions.username);
        }
        // clubId 배열을 쿼리 스트링에 추가
        if (findOptions.club.length > 0) {
            findOptions.club.forEach(club => {
                queryParams.append('clubId', clubIds[club]!.toString()); // club.id가 문자열이 아닐 경우 변환
            });
        }

        if (findOptions.club.length > 0) {
            findOptions.club.forEach(club => {
                queryParams.append('clubId', clubIds[club]!.toString()); // club.id가 문자열이 아닐 경우 변환
            });
        }

        // 최소 학번 추가
        if (findOptions.enrollmentNumberRange.startNumber) {
            queryParams.append('minEnrollmentNumber', findOptions.enrollmentNumberRange.startNumber);
        }

        // 최대 학번 추가
        if (findOptions.enrollmentNumberRange.endNumber) {
            queryParams.append('maxEnrollmentNumber', findOptions.enrollmentNumberRange.endNumber);
        }

        // 최종 URL 생성
        const queryString = queryParams.toString();

        const apiUrl = `${process.env.EXPO_PUBLIC_BASE_URL}/member/invite-possible${queryString ? `?${queryString}` : ''}`;

        return apiUrl;

    }, [findOptions])

    const { data: originList, loading, error }
        = useFetchUsingToken<User[]>(parsedUrl, {}, 5000, [findOptions]);

    useEffect(() => {
        searchInputRef.current?.focus()
    }, [searchBarVisible])

    useEffect(() => {
        if (!!originList) {
            const newUsers = [...originList];

            if (descendingOrder) {
                newUsers.sort((a, b) => Number(b.enrollmentNumber) - Number(a.enrollmentNumber))
            } else {
                newUsers.sort((a, b) => Number(a.enrollmentNumber) - Number(b.enrollmentNumber))
            }

            fiterUser(newUsers);
        }
    }, [descendingOrder, originList]);

    const debounceKeyword = debounce((value) => setFindOptions(prev => ({ ...prev, username: value })), 800)

    // if (originList.length == 0)
    //     return (
    //         )
    return (

        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Header leftButton='close'
                HeaderName={'인원 선택'}
                RightButton={
                    <Icons size={28} name={'search'} color={Color['grey400']} />
                }
                RightAction={() => {
                    setSearchBarVisible(true)
                }}
            />
            {
                <>
                    <Modal visible={optionsSelectState} transparent>
                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }}>
                                <View style={{ marginHorizontal: 24, backgroundColor: '#FFF', paddingVertical: 16, borderRadius: 10, gap: 12 }}>
                                    <View style={{ paddingHorizontal: 24, gap: 24 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 }}>
                                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 16, color: Color['grey700'] }}>옵션</Text>
                                        </View>


                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 }}>

                                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 16, color: Color['grey700'] }}>동아리</Text>

                                        </View>

                                        <View style={{ flexDirection: 'row', paddingHorizontal: 4, gap: 8, flexWrap: 'wrap' }}>
                                            <Pressable style={[fiterBar.box, selectedClubs.length == 0 && { borderColor: Color['blue500'], backgroundColor: Color['blue100'] }]}
                                                onPress={() => setClubsOption([])}>
                                                <Text style={[fiterBar.text, selectedClubs.length == 0 ? { color: Color['blue500'] } : { color: Color['grey600'] }]}>전체</Text>
                                            </Pressable>
                                            {clubs.filter(club => club != '기타').map(club => {
                                                const isSelectedClub = selectedClubs.includes(club);

                                                return (
                                                    <Pressable
                                                        key={club}
                                                        style={[fiterBar.box, isSelectedClub && { borderColor: Color['blue500'], backgroundColor: Color['blue100'] }]}
                                                        onPress={() => {

                                                            if (!isSelectedClub && selectedClubs.length == 3) {
                                                                setClubsOption([])
                                                                return;
                                                            }

                                                            if (isSelectedClub)
                                                                setClubsOption(prev => prev.filter(sclub => sclub != club))
                                                            else
                                                                setClubsOption(prev => ([...prev, club]))

                                                        }}>
                                                        <Text style={[fiterBar.text, isSelectedClub ? { color: Color['blue500'] } : { color: Color['grey600'] }]}>{club}</Text>
                                                    </Pressable>
                                                )
                                            })}
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 }}>

                                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 16, color: Color['grey700'] }}>학번</Text>

                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, position: 'relative', }}>

                                            <View style={{ flexDirection: 'row' }}>
                                                <Pressable style={{ alignItems: 'center', height: 36, width: 36, justifyContent: 'center', backgroundColor: Color['grey300'] }}
                                                    onPress={() => { if (selectedEnrollmentNumberRange.startNumber && Number(selectedEnrollmentNumberRange.startNumber) > 0) setEnrollmentNumberRange(prev => ({ ...prev, startNumber: (Number(prev.startNumber) - 1).toString().padStart(2, '0') })) }}>
                                                    <Icons name='remove' color={Number(selectedEnrollmentNumberRange.startNumber) > 0 ? 'white' : Color['grey200']} size={24}></Icons>
                                                </Pressable>
                                                <Pressable>
                                                    <TextInput
                                                        keyboardType='numeric'
                                                        style={{ width: 48, textAlign: 'center', color: Color['grey600'], height: 36, backgroundColor: Color['grey100'] }}
                                                        value={selectedEnrollmentNumberRange.startNumber}
                                                        onChangeText={(e) => {
                                                            if (e.length == 0) setEnrollmentNumberRange(prev => ({ ...prev, startNumber: undefined }))
                                                            else setEnrollmentNumberRange(prev => ({ ...prev, startNumber: e }))
                                                        }}
                                                        onBlur={() => {
                                                            Keyboard.dismiss();

                                                            if (selectedEnrollmentNumberRange.startNumber?.length == 1) {
                                                                setEnrollmentNumberRange(prev => ({ ...prev, startNumber: "0" + selectedEnrollmentNumberRange.startNumber }))
                                                            } else if (selectedEnrollmentNumberRange.startNumber?.length == 2) {
                                                                if (Number(selectedEnrollmentNumberRange.startNumber) > MaxEnrollmentNumber)
                                                                    if (selectedEnrollmentNumberRange.endNumber)
                                                                        setEnrollmentNumberRange({ endNumber: "25", startNumber: "25" })
                                                                    else
                                                                        setEnrollmentNumberRange(prev => ({ ...prev, startNumber: "25" }))
                                                            }
                                                        }}
                                                        placeholder='-' />
                                                </Pressable>
                                                <Pressable style={{ alignItems: 'center', height: 36, width: 36, justifyContent: 'center', backgroundColor: Color['grey300'] }}
                                                    onPress={() => { if (selectedEnrollmentNumberRange.startNumber && Number(selectedEnrollmentNumberRange.startNumber) < Number(selectedEnrollmentNumberRange.endNumber || MaxEnrollmentNumber) - 1) setEnrollmentNumberRange(prev => ({ ...prev, startNumber: (Number(prev.startNumber) + 1).toString().padStart(2, '0') })) }}>
                                                    <Icons name='add' color={Number(selectedEnrollmentNumberRange.startNumber) < Number(selectedEnrollmentNumberRange.endNumber || MaxEnrollmentNumber) - 1 ? 'white' : Color['grey200']} size={24}></Icons>
                                                </Pressable>
                                            </View>
                                            <View style={{ height: 36, justifyContent: 'center' }}>
                                                <Text style={{ fontFamily: 'NanumSquareNeo-Light', textAlign: 'center', fontSize: 16 }}>~</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row' }}>

                                                <Pressable style={{ alignItems: 'center', height: 36, width: 36, justifyContent: 'center', backgroundColor: Color['grey300'] }}
                                                    onPress={() => { if (selectedEnrollmentNumberRange.endNumber && Number(selectedEnrollmentNumberRange.endNumber) > Number(selectedEnrollmentNumberRange.startNumber || 0) + 1) setEnrollmentNumberRange(prev => ({ ...prev, endNumber: (Number(prev.endNumber) - 1).toString().padStart(2, '0') })) }}>
                                                    <Icons name='remove' color={Number(selectedEnrollmentNumberRange.endNumber) > Number(selectedEnrollmentNumberRange.startNumber || 0) + 1 ? 'white' : Color['grey200']} size={24}></Icons>
                                                </Pressable>
                                                <Pressable>
                                                    <TextInput
                                                        keyboardType='numeric'
                                                        maxLength={2}
                                                        style={{ width: 48, textAlign: 'center', color: Color['grey600'], height: 36, backgroundColor: Color['grey100'] }}
                                                        value={selectedEnrollmentNumberRange.endNumber}
                                                        onChangeText={(e) => {
                                                            if (e.length == 0) setEnrollmentNumberRange(prev => ({ ...prev, endNumber: undefined }))
                                                            else setEnrollmentNumberRange(prev => ({ ...prev, endNumber: e }))
                                                        }}
                                                        onBlur={() => {
                                                            Keyboard.dismiss();
                                                            if (selectedEnrollmentNumberRange.endNumber?.length == 1) {
                                                                setEnrollmentNumberRange(prev => ({ ...prev, endNumber: "0" + selectedEnrollmentNumberRange.endNumber }))
                                                            } else if (selectedEnrollmentNumberRange.endNumber?.length == 2) {
                                                                if (Number(selectedEnrollmentNumberRange.endNumber) > MaxEnrollmentNumber)
                                                                    setEnrollmentNumberRange(prev => ({ ...prev, endNumber: "25" }))
                                                            }
                                                        }}
                                                        placeholder='-' />
                                                </Pressable>
                                                <Pressable style={{ alignItems: 'center', height: 36, width: 36, justifyContent: 'center', backgroundColor: Color['grey300'] }}
                                                    onPress={() => { if (selectedEnrollmentNumberRange.endNumber && Number(selectedEnrollmentNumberRange.endNumber) < MaxEnrollmentNumber) setEnrollmentNumberRange(prev => ({ ...prev, endNumber: (Number(prev.endNumber) + 1).toString().padStart(2, '0') })) }}>
                                                    <Icons name='add' color={Number(selectedEnrollmentNumberRange.endNumber) < 25 ? 'white' : Color['grey200']} size={24}></Icons>
                                                </Pressable>
                                            </View>

                                        </View>

                                    </View>
                                    <View style={{ paddingHorizontal: 16, justifyContent: 'center', gap: 16, paddingTop: 8, flexDirection: 'row' }}>
                                        <ShortButton
                                            color='blue'
                                            isFilled={false}
                                            innerText={`초기화 적용`}
                                            onPress={() => {
                                                setFindOptions(prev => ({ ...prev, club: [], enrollmentNumberRange: {} }))
                                                setClubsOption([])
                                                setEnrollmentNumberRange({})
                                                setOptionSelectState(false)
                                            }}
                                        />
                                        <ShortButton
                                            color='blue'
                                            isFilled
                                            innerText={`옵션 적용`}
                                            onPress={() => {
                                                setFindOptions(prev => ({ ...prev, club: selectedClubs, enrollmentNumberRange: selectedEnrollmentNumberRange }))
                                                setOptionSelectState(false)
                                            }}
                                        />
                                    </View>

                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    <View style={{ zIndex: 5, position: 'relative' }}>
                        {searchBarVisible &&
                            <View style={{ backgroundColor: Color['grey100'], paddingHorizontal: 24, paddingVertical: 8 }}>
                                <View style={{ backgroundColor: '#fff', borderRadius: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput
                                        ref={searchInputRef}
                                        onChangeText={value => { debounceKeyword(value); }}
                                        style={{ paddingHorizontal: 12, fontSize: 16, height: 32, flex: 1 }}
                                    >
                                    </TextInput>
                                    <Pressable style={{ height: 36, width: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                        onPress={() => { setSearchBarVisible(false); setFindOptions(prev => ({ ...prev, username: '' })) }}>
                                        <Icons size={24} name={'close-circle'} color={Color['grey300']} />
                                    </Pressable>
                                </View>

                            </View>
                        }
                        <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={{ height: 32, marginTop: 8, marginHorizontal: 24, gap: 8, alignItems: 'flex-start', paddingHorizontal: 4 }}>
                            <Pressable style={[fiterBar.box, { flexDirection: 'row', alignItems: 'center', gap: 2 }]}
                                onPress={() => { setDescendingOrder(!descendingOrder); }}>
                                <Text style={fiterBar.text}>학번순</Text>
                                <Icons size={20} name={descendingOrder ? 'arrow-down' : 'arrow-up'} color={Color['blue400']} />
                            </Pressable>
                            {findOptions.club.length > 0 &&
                                <View style={[fiterBar.box, { borderColor: Color['blue500'], backgroundColor: Color['blue100'] }]}>
                                    <Text style={[fiterBar.text, { fontFamily: 'NanumSquareNeo-Bold', color: Color['blue500'] }]}>동아리:{findOptions.club.map(club => club).join(', ')}</Text>
                                </View>
                            }
                            {findOptions.enrollmentNumberRange.startNumber &&
                                <View style={[fiterBar.box, { borderColor: Color['blue500'], backgroundColor: Color['blue100'] }]}>
                                    <Text style={[fiterBar.text, { fontFamily: 'NanumSquareNeo-Bold', color: Color['blue500'] }]}>최소 학번:{findOptions.enrollmentNumberRange.startNumber}</Text>
                                </View>
                            }
                            {findOptions.enrollmentNumberRange.endNumber &&
                                <View style={[fiterBar.box, { borderColor: Color['blue500'], backgroundColor: Color['blue100'] }]}>
                                    <Text style={[fiterBar.text, { fontFamily: 'NanumSquareNeo-Bold', color: Color['blue500'] }]}>최대 학번:{findOptions.enrollmentNumberRange.endNumber}</Text>
                                </View>
                            }
                            <Pressable style={[fiterBar.filter, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}
                                onPress={() => { setOptionSelectState(true) }}>
                                <Text style={{ color: Color['grey400'] }}>필터 변경</Text>
                                <Icons size={20} name={'funnel'} color={Color['grey300']} />
                            </Pressable>

                        </ScrollView>
                    </View>
                    {originList?.length == 0 ?
                        <View style={{ backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <Text style={{ marginHorizontal: 'auto', fontFamily: 'NanumSquareNeo-Bold', fontSize: 18, color: Color['grey400'] }}>
                                함께 할 수 있는 인원이 없습니다.
                            </Text>
                        </View>
                        :
                        <View style={{ flex: 1, zIndex: 1, marginTop: 12, position: 'relative' }}>

                            <FlatList
                                onEndReached={()=>{console.log('새 유저들 로드하기')}}
                                contentContainerStyle={{ marginHorizontal: 24, backgroundColor: '#FFF', zIndex: 1 }}
                                data={originList}
                                keyExtractor={(item) => item.memberId.toString()}
                                renderItem={({ item }: { item: User }) => {

                                    const isPicked = useMemo(() => {
                                        return reservation.participators.some(participant =>
                                            participant.memberId === item.memberId
                                        );
                                    }, [reservation.participators, item.memberId]);


                                    return (
                                        <UserPickerCard
                                            user={item}
                                            isPicked={isPicked}
                                            onPress={() => {
                                                if (!isPicked) setNewParticipators([...newParticipators, item])
                                                else setNewParticipators(newParticipators.filter((participator) => participator.memberId != item.memberId))
                                            }}
                                        />
                                    )
                                }}

                                ItemSeparatorComponent={() => (<View style={{ height: 12 }} />)}
                            />
                        </View>
                    }

                    {reservation.participators.length > 0 && <View style={{ paddingTop: 12, width: '100%' }}>

                        <View style={{ paddingHorizontal: 28, }}>
                            <Text style={{
                                paddingHorizontal: 4,
                                fontFamily: 'NanumSquareNeo-Regular',
                            }}>선택한 인원</Text>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 28, paddingVertical: 12, gap: 4 }}>
                            {newParticipators.map(participator => (

                                <View style={[{
                                    paddingVertical: 4,
                                    paddingHorizontal: 8,
                                    borderRadius: 15,
                                    borderWidth: 1,
                                    borderColor: Color['grey200'],
                                    justifyContent: 'center',
                                    zIndex: 0,
                                    backgroundColor: '#FFF',
                                    flexDirection: 'row', alignItems: 'center', gap: 2
                                }]}>

                                    <Text style={[fiterBar.text, { color: Color['grey500'] }]}>{participator.name}{participator.nickname ? `(${participator.nickname})` : ''}</Text>

                                    <Pressable
                                        onPress={() => { setNewParticipators(newParticipators.filter((participatorData) => participatorData.memberId != participator.memberId)) }}>
                                        <Icons name='close-circle' size={24} color={Color['grey400']}></Icons>
                                    </Pressable>

                                </View>
                            ))}
                        </ScrollView>

                        <LongButton
                            color='blue'
                            isAble={true}
                            onPress={() => navigation.pop()}
                            innerContent={`선택완료 (${reservation.participators.length})`}
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
        zIndex: 0,
        backgroundColor: '#FFF'
    },
    text: {
        fontFamily: 'NanumSquareNeo-Regular',
        fontSize: 14,
    },
    filter: {
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: Color['grey100'],
        height: 32,
        fontFamily: 'NanumSquareNeo-Regular',
        gap: 4,
        justifyContent: 'center',
    }
})