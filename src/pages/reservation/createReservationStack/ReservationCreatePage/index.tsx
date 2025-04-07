import { useCallback, useState } from "react"
import { ScrollView, View } from "react-native"

import { useNavigation } from "@react-navigation/native"

import { Checkbox } from "@hongpung/src/common"

import { useCreateReservation } from "@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context"
import { CreateReservationButton } from "@hongpung/src/features/reservation/createReservation/ui/CreateReservationButton/CreateReservationButton"

import { ReservationForm } from "@hongpung/src/widgets/reservation/ui/ReservationForm/ReservationForm"

const ReservationCreatePage: React.FC = () => {

    const [isAgree, setAgree] = useState(false)

    const navigation = useNavigation();

    const {
        reservation,

        setTitle,
        setParticipators,
        setBorrowInstruments,
        setParticipationAvailable,
        setReservationType,

    } = useCreateReservation();

    const resetParticipators = useCallback(
        () => setParticipators([]), 
        [setParticipators]
    );

    const resetBorrowInstruments = useCallback(
        () => setBorrowInstruments([]), 
        [setBorrowInstruments]
    );

    const goToDateSelect = useCallback(
        () => navigation.navigate('ReservationDateSelectPage'),
        []
    );
    const goToTimeSelect = useCallback(
        () => navigation.navigate('ReservationDateSelectPage'),
        []
    );
    const goToParticipatorsSelect = useCallback(
        () => navigation.navigate('ParticipatorsPickerPage'),
        []
    );
    const goToBorrowInstrumentsSelect = useCallback(
        () => navigation.navigate('BorrowInstrumentsPickerPage'),
        []
    );

    const goToReservationCreateComplete = useCallback(
        () => navigation.navigate('ReservationCreateCompletePage'),
        []
    );

    return (
        <View>
            <ScrollView contentContainerStyle={{ flex: 1 }}>

                <ReservationForm

                    reservation={reservation}

                    navigateDatePickerPage={goToDateSelect}
                    navigateTimePickerPage={goToTimeSelect}

                    setTitle={setTitle}

                    setParticipationAvailable={setParticipationAvailable}
                    setReservationType={setReservationType}

                    resetParticipators={resetParticipators}
                    navigateToParticipatorsPickerPage={goToParticipatorsSelect}

                    resetBorrowInstruments={resetBorrowInstruments}
                    navigateToBorrowInstrumentsPickerPage={goToBorrowInstrumentsSelect}

                />

            </ScrollView>

            <View style={{ flexDirection: 'column', gap: 8, paddingVertical: 16, paddingHorizontal: 24 }}>
                
                <Checkbox
                    isChecked={isAgree}
                    onCheck={setAgree}
                    innerText="예약 전날 오후10시까지 수정*취소할 수 있어요"
                />

                <CreateReservationButton
                    isAgree={isAgree}
                    onPress={goToReservationCreateComplete}
                />

            </View>
        </View>
    )
}

export default ReservationCreatePage;