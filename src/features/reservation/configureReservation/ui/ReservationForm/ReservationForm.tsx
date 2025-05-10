import { ScrollView } from "react-native";
import React, { useCallback } from "react";
import { type ReservationForm as ReservationFormType } from "@hongpung/src/entities/reservation";

import { ReservationTypeSelector } from "../ReservationTypeSelector/ReservationTypeSelector";
import { ParticipatorsSelector } from "../ParticipatorsSelector/ParticipatorsSelector";
import BorrowInstrumentsSelector from "../BorrowInstrumentsSelector/BorrowInstrumentsSelector";
import { TitleInput } from "../TitleInput/TitleInput";
import { DateTimeSelector } from "../DateTimeSelector/DateTimeSelector";

type ReservationFormProps = {
  reservation: ReservationFormType;

  setTitle: (title: string) => void;

  setParticipationAvailable: (available: boolean) => void;
  setReservationType: (type: Exclude<ReservationType, "EXTERNAL">) => void;

  resetParticipators: () => void;
  resetBorrowInstruments: () => void;

  navigateToParticipatorsPickerPage: () => void;
  navigateToBorrowInstrumentsPickerPage: () => void;

  navigateDatePickerPage: () => void;
  navigateTimePickerPage: () => void;
};

export const ReservationForm: React.FC<ReservationFormProps> = (props) => {
  const {
    reservation,

    setTitle,
    setParticipationAvailable,
    setReservationType,

    resetParticipators,
    resetBorrowInstruments,

    navigateDatePickerPage,
    navigateTimePickerPage,

    navigateToParticipatorsPickerPage,
    navigateToBorrowInstrumentsPickerPage,
  } = props;

  const {
    startTime,
    endTime,
    title,
    participationAvailable,
    reservationType,
    participators,
    borrowInstruments,
    date,
  } = reservation;

  const onDateTimePress = useCallback(() => {
    if (!date) {
      navigateDatePickerPage();
    } else {
      navigateDatePickerPage();
      navigateTimePickerPage();
    }
  }, [date]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FFF" }}
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FFF", gap: 24 }}
    >
      <DateTimeSelector
        date={date}
        startTime={startTime}
        endTime={endTime}
        onPress={onDateTimePress}
      />

      <TitleInput title={title} setTitle={setTitle} />

      <ReservationTypeSelector
        participationAvailable={participationAvailable}
        reservationType={reservationType}
        setParticipationAvailable={setParticipationAvailable}
        setReservationType={setReservationType}
      />

      <ParticipatorsSelector
        onPress={navigateToParticipatorsPickerPage}
        participators={participators}
        resetParticipator={resetParticipators}
      />

      <BorrowInstrumentsSelector
        onPress={navigateToBorrowInstrumentsPickerPage}
        borrowInstruments={borrowInstruments}
        resetBorrowInstruments={resetBorrowInstruments}
      />
    </ScrollView>
  );
};
