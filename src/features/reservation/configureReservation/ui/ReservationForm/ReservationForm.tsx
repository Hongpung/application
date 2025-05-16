import { ScrollView, View } from "react-native";
import React, { useCallback, useState } from "react";
import { type ReservationForm as ReservationFormType } from "@hongpung/src/entities/reservation";

import { ReservationTypeSelector } from "../ReservationTypeSelector/ReservationTypeSelector";
import { ParticipatorsSelector } from "../ParticipatorsSelector/ParticipatorsSelector";
import BorrowInstrumentsSelector from "../BorrowInstrumentsSelector/BorrowInstrumentsSelector";
import { TitleInput } from "../TitleInput/TitleInput";
import { DateTimeSelector } from "../DateTimeSelector/DateTimeSelector";
import { Checkbox, LongButton } from "@hongpung/src/common";

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

  submitButtonText: string;
  canSubmit: boolean;
  onSubmit: (reservation: ReservationFormType) => void;
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

    submitButtonText,
    canSubmit,
    onSubmit,
  } = props;

  const [isAgree, setAgree] = useState(false);

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
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#FFF" }}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#FFF",
          gap: 24,
        }}
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
      <View style={{ paddingVertical: 16, gap: 12, borderTopLeftRadius: 16, borderTopRightRadius: 16, backgroundColor: "#FFF" }}>
        <View style={{ paddingHorizontal: 32 }}>
          <Checkbox
            isChecked={isAgree}
            onCheck={setAgree}
            innerText="예약 전날 오후10시까지 수정*취소할 수 있어요"
          />
        </View>
        <LongButton
          onPress={() => onSubmit(reservation)}
          innerContent={submitButtonText}
          isAble={canSubmit&&isAgree}
          color="blue"
        />
      </View>
    </View>
  );
};
