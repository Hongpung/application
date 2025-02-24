import { ReservationDTO } from "@hongpung/pages/Reservation/ReservationInterface"
import { Checkbox, LongButton } from "@hongpung/src/common"
import { DateTimeSelector } from "@hongpung/src/widgets/reservation/ui/date-time-selector"
import { BorrowInstrumentSelector } from "@hongpung/src/widgets/reservation/ui/instrument-selector"
import { ParticipantsSelector } from "@hongpung/src/widgets/reservation/ui/participator-selector"
import { ReservationTypeSelector } from "@hongpung/src/widgets/reservation/ui/reservation-type-selector"
import { TitleInput } from "@hongpung/src/widgets/reservation/ui/title-input"
import { useState } from "react"
import { ScrollView, View } from "react-native"

export const ReservationPage = () => {

    const [isAgree, setAgree] = useState(false)
    const [reservation, setReservation] = useState<Partial<ReservationDTO>>({
        participators: [],
        borrowInstruments: []
    })

    return (
        <View>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <DateTimeSelector
                    as={View}
                />
                <TitleInput
                    title={reservation.title}
                    setTitle={(newTitle) => setReservation(prev => ({ ...prev, title: newTitle }))}
                />
                <ReservationTypeSelector
                    participationAvailable={reservation.participationAvailable}
                    setParticipationAvailable={(newValue) => setReservation(prev => ({ ...prev, participationAvailable: newValue }))}
                    reservationType={reservation.reservationType}
                    setReservationType={(changedType) => setReservation(prev => ({ ...prev, reservationType: changedType }))}
                />
                <ParticipantsSelector
                    onPress={() => { }}
                    participators={reservation.participators!}
                    resetParticipator={() => setReservation(prev => ({ ...prev, participators: [] }))}
                />
                <BorrowInstrumentSelector
                    onPress={() => { }}
                    borrowInstruments={reservation.borrowInstruments!}
                    resetBorrowInstruments={() => setReservation(prev => ({ ...prev, borrowInstruments: [] }))}
                />
            </ScrollView>

            <View>
                <Checkbox
                    isChecked={isAgree}
                    onCheck={setAgree}
                    innerText="예약 전날 오후10시까지 수정*취소할 수 있어요"
                />
                <LongButton
                    innerText="확인"
                    isAble={!Object.entries(reservation).some(([key, value]) => key != 'title' && value === undefined)}
                    color="blue"
                    onPress={() => { }}
                />
            </View>
        </View>
    )
}