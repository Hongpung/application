import { Checkbox, LongButton } from "@hongpung/src/common"

import { useCallback, useState } from "react"
import { ScrollView, View } from "react-native"
import { ReservationForm } from "@hongpung/src/widgets/reservation/ui/ReservationForm/ReservationForm"
import { useEditReservation } from "@hongpung/src/features/reservation/editReservation/model/useEditReservation.context"
import { useNavigation } from "@react-navigation/native"
import { EditReservationButton } from "@hongpung/src/features/reservation/editReservation/ui/EditReservationButton/EditReservationButton"

const ReservationEditPage: React.FC = () => {

    const [isAgree, setAgree] = useState(false)

    const navigation = useNavigation()

    const {
        reservation,

        setTitle,
        setParticipationAvailable,
        setReservationType,
        setParticipators,
        setBorrowInstruments,

        verifyEditReservation

    } = useEditReservation()


    const resetParticipators = useCallback(
        () => setParticipators([]), 
        [setParticipators]
    );

    const resetBorrowInstruments = useCallback(
        () => setBorrowInstruments([]), 
        [setBorrowInstruments]
    );

    const goToDateSelect = useCallback(
        () => navigation.navigate('EditReservationDateSelectPage'),
        []
    );
    const goToTimeSelect = useCallback(
        () => navigation.navigate('EditReservationDateSelectPage'),
        []
    );
    const goToParticipatorsSelect = useCallback(
        () => navigation.navigate('EditParticipatorsPickerPage'),
        []
    );
    const goToBorrowInstrumentsSelect = useCallback(
        () => navigation.navigate('EditBorrowInstrumentsPickerPage'),
        []
    );

    const goToEditReservationConfirmPage = useCallback(
        () => navigation.navigate('EditReservationConfirmPage'),
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

            <View>

                <Checkbox
                    isChecked={isAgree}
                    onCheck={setAgree}
                    innerText="예약 전날 오후10시까지 수정·취소할 수 있어요"
                />

                <EditReservationButton
                    isAgree={isAgree}
                    onPress={() => verifyEditReservation(goToEditReservationConfirmPage)}
                />

            </View>
        </View>
    )
}


export default ReservationEditPage;