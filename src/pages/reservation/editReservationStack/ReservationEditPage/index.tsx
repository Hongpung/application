import { Header } from "@hongpung/src/common";

import { useCallback } from "react";
import { View } from "react-native";
import { ReservationForm } from "@hongpung/src/features/reservation/configureReservation/ui/ReservationForm/ReservationForm";
import { useEditReservation } from "@hongpung/src/features/reservation/editReservation/model/useEditReservation.context";
import { EditReservationStackScreenProps } from "@hongpung/src/common/navigation";

const ReservationEditPage: React.FC<
  EditReservationStackScreenProps<"EditReservationForm">
> = ({ navigation, route }) => {
  const {
    reservation,

    setTitle,
    setParticipationAvailable,
    setReservationType,
    setParticipators,
    setBorrowInstruments,

    verifyEditReservation,
    isValidReservation,
  } = useEditReservation();

  const resetParticipators = useCallback(
    () => setParticipators([]),
    [setParticipators],
  );

  const resetBorrowInstruments = useCallback(
    () => setBorrowInstruments([]),
    [setBorrowInstruments],
  );

  const goToDateSelect = useCallback(
    () => navigation.navigate("EditReservationDateSelect"),
    [navigation],
  );
  const goToTimeSelect = useCallback(
    () => navigation.navigate("EditReservationTimeSelect"),
    [navigation],
  );
  const goToParticipatorsSelect = useCallback(
    () => navigation.navigate("EditReservationParticipatorsSelect"),
    [navigation],
  );
  const goToBorrowInstrumentsSelect = useCallback(
    () => navigation.navigate("EditReservationBorrowInstrumentsSelect"),
    [navigation],
  );

  const goToEditReservationConfirmPage = useCallback(
    () => navigation.navigate("EditReservationConfirm"),
    [navigation],
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Header LeftButton={"close"} headerName="예약 내용 변경" />
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
        submitButtonText={"변경하기"}
        canSubmit={isValidReservation}
        onSubmit={() => verifyEditReservation(goToEditReservationConfirmPage)}
      />
    </View>
  );
};

export default ReservationEditPage;
