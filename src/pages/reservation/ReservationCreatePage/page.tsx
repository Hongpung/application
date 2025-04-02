import { ReservationDTO } from "@hongpung/pages/Reservation/ReservationInterface"
import { Checkbox, LongButton } from "@hongpung/src/common"
import { DateTimeViewer } from "@hongpung/src/entities/reservation/ui/DateTimeViewer/DateTimeViewer"
import { BorrowInstrumentsSelector } from "@hongpung/src/features/reservation/figureReservation/ui/BorrowInstrumentsSelector/BorrowInstrumentsSelector"
import { ParticipatorsSelector } from "@hongpung/src/features/reservation/figureReservation/ui/ParticipatorsSelector/ParticipatorsSelector"
import { ReservationTypeSelector } from "@hongpung/src/entities/reservation/ui/ReservationTypeSelector/ReservationTimeSelector"
import { TitleInput } from "@hongpung/src/features/reservation/figureReservation/ui/TitleInput/TitleInput"
import { useState } from "react"
import { ScrollView, View } from "react-native"

export const ReservationPage: React.FC = () => {

    const [isAgree, setAgree] = useState(false)
    const [reservation, setReservation] = useState<Partial<ReservationDTO>>({
        participators: [],
        borrowInstruments: []
    })

    return (
        <View>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                
                <DateTimeViewer
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
                <ParticipatorsSelector
                    onPress={() => { }}
                    participators={reservation.participators!}
                    resetParticipator={() => setReservation(prev => ({ ...prev, participators: [] }))}
                />
                <BorrowInstrumentsSelector
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
                    innerContent="확인"
                    isAble={!Object.entries(reservation).some(([key, value]) => key != 'title' && value === undefined)}
                    color="blue"
                    onPress={() => { }}
                />
            </View>
        </View>
    )
}