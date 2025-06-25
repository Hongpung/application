import { useCallback, useEffect } from "react";
import { View } from "react-native";

import { Header } from "@hongpung/src/common";

import { useCreateReservation } from "@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context";

import { ReservationForm } from "@hongpung/src/features/reservation/configureReservation";
import { CreateReservationStackScreenProps } from "@hongpung/src/common/navigation/createReservation";

const ReservationCreatePage: React.FC<
  CreateReservationStackScreenProps<"CreateReservationForm">
> = ({ navigation, route }) => {
  const { date } = route.params || {};
  const {
    reservation,

    setTitle,
    setParticipators,
    setBorrowInstruments,
    setParticipationAvailable,
    setReservationType,
    setDate,
    isValidReservation,
  } = useCreateReservation();

  useEffect(() => {
    if (date) {
      setDate(date);
    }
  }, [date, setDate]);

  const resetParticipators = useCallback(
    () => setParticipators([]),
    [setParticipators],
  );

  const resetBorrowInstruments = useCallback(
    () => setBorrowInstruments([]),
    [setBorrowInstruments],
  );

  const goToDateSelect = useCallback(
    () => navigation.navigate("CreateReservationDateSelect"),
    [navigation],
  );
  const goToTimeSelect = useCallback(
    () => navigation.navigate("CreateReservationTimeSelect"),
    [navigation],
  );
  const goToParticipatorsSelect = useCallback(
    () => navigation.navigate("CreateReservationParticipatorsSelect"),
    [navigation],
  );
  const goToBorrowInstrumentsSelect = useCallback(
    () => navigation.navigate("CreateReservationBorrowInstrumentsSelect"),
    [navigation],
  );

  const goToReservationCreateComplete = useCallback(
    () => navigation.navigate("CreateReservationConfirm"),
    [navigation],
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Header LeftButton="close" headerName="신규 예약 작성" />
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
        submitButtonText="예약하기"
        canSubmit={isValidReservation}
        onSubmit={goToReservationCreateComplete}
      />
    </View>
  );
};

export default ReservationCreatePage;
