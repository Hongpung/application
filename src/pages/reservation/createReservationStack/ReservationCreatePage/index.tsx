import { useCallback, useState } from "react";
import { View } from "react-native";

import { Checkbox, Header, LongButton } from "@hongpung/src/common";

import { useCreateReservation } from "@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context";

import { ReservationForm } from "@hongpung/src/features/reservation/configureReservation";
import { CreateReservationStackScreenProps } from "@hongpung/src/common/navigation/createReservation";

const ReservationCreatePage: React.FC<
  CreateReservationStackScreenProps<"CreateReservationForm">
> = ({ navigation }) => {
  const [isAgree, setAgree] = useState(false);

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
    () => navigation.navigate("CreateReservationDateSelect"),
    [navigation]
  );
  const goToTimeSelect = useCallback(
    () => navigation.navigate("CreateReservationTimeSelect"),
    [navigation]
  );
  const goToParticipatorsSelect = useCallback(
    () => navigation.navigate("CreateReservationParticipatorsSelect"),
    [navigation]
  );
  const goToBorrowInstrumentsSelect = useCallback(
    () => navigation.navigate("CreateReservationBorrowInstrumentsSelect"),
    [navigation]
  );

  const goToReservationCreateComplete = useCallback(
    () => navigation.navigate("CreateReservationConfirm"),
    [navigation]
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Header
        leftButton="close"
        headerName="신규 예약 작성"
      />
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

      <View
        style={{
          flexDirection: "column",
          gap: 8,
          paddingVertical: 16,
          paddingHorizontal: 24,
        }}
      >
        <Checkbox
          isChecked={isAgree}
          onCheck={setAgree}
          innerText="예약 전날 오후10시까지 수정*취소할 수 있어요"
        />

        <LongButton
          innerContent="예약하기"
          color="blue"
          isAble={isAgree}
          onPress={goToReservationCreateComplete}
        />
      </View>
    </View>
  );
};

export default ReservationCreatePage;
