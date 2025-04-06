import { useState } from "react"
import { ScrollView, View } from "react-native"

import { useNavigation } from "@react-navigation/native"

import { Checkbox, LongButton } from "@hongpung/src/common"
import { useCreateReservation } from "@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context"
import { ReservationForm } from "@hongpung/src/widgets/reservation/ui/ReservationForm/ReservationForm"

export const ReservationPage: React.FC = () => {

    const [isAgree, setAgree] = useState(false)

    const navigation = useNavigation()

    const {
        reservation,

        setTitle,
        setParticipators,
        setBorrowInstruments,
        setParticipationAvailable,
        setReservationType,

        isValidReservation,

    } = useCreateReservation()

    return (
        <View>
            <ScrollView contentContainerStyle={{ flex: 1 }}>

                <ReservationForm
                    reservation={reservation}
                    setTitle={setTitle}
                    setParticipationAvailable={setParticipationAvailable}

                    setReservationType={setReservationType}

                    resetParticipators={() => setParticipators([])}
                    resetBorrowInstruments={() => setBorrowInstruments([])}

                    navigateDatePickerPage={navigation.navigate.bind(navigation, 'ReservationDateSelectPage')}
                    navigateTimePickerPage={navigation.navigate.bind(navigation, 'ReservationTimeSelectPage')}
                    navigateToParticipatorsPickerPage={navigation.navigate.bind(navigation, 'ParticipatorsPickerPage')}
                    navigateToBorrowInstruemntPickerPage={navigation.navigate.bind(navigation, 'BorrowInstrumentsPickerPage')}
                />

            </ScrollView>

            <View>
                <Checkbox
                    isChecked={isAgree}
                    onCheck={setAgree}
                    innerText="예약 전날 오후10시까지 수정*취소할 수 있어요"
                />

                <LongButton
                    innerContent="확인"
                    isAble={isValidReservation && isAgree}
                    color="blue"
                    onPress={() => { navigation.navigate('ReservationCreateCompletePage') }}
                />
            </View>
        </View>
    )
}