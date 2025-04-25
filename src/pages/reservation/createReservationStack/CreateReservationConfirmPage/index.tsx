import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";

import { useRecoilValue } from "recoil";

import { Color, Icons } from "@hongpung/src/common";
import { Header } from "@hongpung/src/common";

import { UserStatusState } from "@hongpung/src/entities/member";

import { useCreateReservation } from "@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context";
import { reservationFormSubTitle } from "@hongpung/src/features/reservation/model/type";
import { daysOfWeek } from "@hongpung/src/common/constant/dayOfWeek";
import { useNavigation } from "@react-navigation/native";
import { CreateReservationButton } from "@hongpung/src/features/reservation/createReservation/ui/CreateReservationButton/CreateReservationButton";


const CreateReservation = () => {

    const { reservation, isValidReservation, requestCreateReservation } = useCreateReservation();

    const loginUser = useRecoilValue(UserStatusState);
    const navigation = useNavigation();

    if (!isValidReservation) {
        Alert.alert('오류', '잘못된 접근입니다.')
        return (
            <View>
                <Header
                    leftButton={'close'}
                    headerName="예약 작성 정보 확인"
                />
            </View>)
    }

    return (
        <View style={CreateReservationStyles.container}>

            <Header
                leftButton={'close'}
                headerName="예약 작성 정보 확인"
            />

            <View style={CreateReservationStyles.blockContainer}>
                <View style={CreateReservationStyles.rowItemContainer}>
                    <Text style={CreateReservationStyles.leftText}>{reservationFormSubTitle.date}</Text>
                    <Text style={CreateReservationStyles.rightText}>{reservation.date} ({daysOfWeek[new Date(reservation.date!).getDay()]})</Text>
                </View>
                <View style={CreateReservationStyles.rowItemContainer}>
                    <Text style={CreateReservationStyles.leftText}>예약 시간</Text>
                    <Text style={CreateReservationStyles.rightText}>{`${reservation.startTime} ~ ${reservation.endTime}`}</Text>
                </View>
                <View style={CreateReservationStyles.rowItemContainer}>
                    <Text style={CreateReservationStyles.leftText}>예약자</Text>
                    <Text style={CreateReservationStyles.rightText}>{`${loginUser?.nickname ? `${loginUser?.name}(${loginUser.nickname})` : loginUser?.name}`}</Text>
                </View>
                <View style={CreateReservationStyles.rowItemContainer}>
                    <Text style={CreateReservationStyles.leftText}>예약명</Text>
                    <Text style={CreateReservationStyles.rightText}>{reservation.title.length > 0 ? reservation.title : `${loginUser?.nickname ? loginUser.nickname : loginUser?.name}의 연습`}</Text>
                </View>
            </View>

            <View style={{ borderRadius: 15, marginHorizontal: 16, paddingHorizontal: 16, paddingVertical: 4, backgroundColor: '#FFF' }}>

                <View style={CreateReservationStyles.rowItemContainer}>
                    <Text style={CreateReservationStyles.leftText}>예약 유형</Text>
                    <Text style={CreateReservationStyles.rightText}>{reservation.reservationType === 'REGULAR' ? '정기 연습' : '개인 연습'} ({reservation.participationAvailable ? '참여 가능' : '참여 불가'})</Text>
                </View>

                <View style={CreateReservationStyles.rowItemContainer}>
                    <Text style={CreateReservationStyles.leftText}>참여자</Text>

                    {reservation.participators.length > 0 ?
                        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>

                            <Text style={[CreateReservationStyles.rightText, { maxWidth: 156 }]} numberOfLines={1}>

                                {
                                    reservation.participators.slice(0, 3).map(user => user.name).join(', ')
                                }
                                {
                                    reservation.participators.length > 3 && `외 ${reservation.participators.length - 3}명`
                                }
                            </Text>
                            s
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ReservationParticipatorsView', { participators: JSON.stringify(reservation.participators) })}
                            >
                                <Icons size={16} color={Color['grey300']} name={'chevron-forward'} />

                            </TouchableOpacity>

                        </View>
                        :
                        <Text>
                            없음
                        </Text>
                    }
                </View>

                <View style={CreateReservationStyles.rowItemContainer}>
                    <Text style={CreateReservationStyles.leftText}>대여 악기</Text>

                    {reservation.borrowInstruments.length > 0 ?
                        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                            <Text style={CreateReservationStyles.rightText}>

                                {instrumentTypes.filter(type => type != '징').map((type) => {
                                    const instCount = reservation.borrowInstruments.filter((instrument) => instrument.instrumentType == type).length
                                    if (instCount > 0)
                                        return `${type} ${instCount}`
                                }).filter(Boolean).join(', ')}

                            </Text>

                            <TouchableOpacity
                                onPress={() => { navigation.navigate('ReservationInstrumentsView', { instruments: JSON.stringify(reservation.borrowInstruments) }) }}
                            >
                                <Icons size={16} color={Color['grey300']} name={'chevron-forward'}></Icons>

                            </TouchableOpacity>

                        </View>

                        : <Text style={[CreateReservationStyles.rightText, { color: Color['grey300'] }]}>{'없음'}</Text>}


                </View>
            </View>

            <View>
                <CreateReservationButton
                    isAgree={true}
                    onPress={requestCreateReservation}
                />
            </View>
        </View>
    )
}

export default CreateReservation;

const CreateReservationStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    blockContainer: {
        borderRadius: 15,
        marginHorizontal: 16,
        paddingHorizontal: 16,
        paddingVertical: 4,
        backgroundColor: '#FFF',
    },
    rowItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 14,
    },
    leftText: {
        fontFamily: 'NanumSquareNeo-Regular',
        fontSize: 16,
        color: Color['grey400'],
    },
    rightText: {
        fontFamily: 'NanumSquareNeo-Bold',
        fontSize: 16,
        color: Color['grey700'],
    },
    subName: {
        fontSize: 16,
        color: Color['grey400'],
    },
});
