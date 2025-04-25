import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { Instrument } from "@hongpung/src/entities/instrument";
import { useCreateReservation } from "@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context";
import { Header } from "@hongpung/src/common";
import { Color } from "@hongpung/src/common";

import { useBorrowPossibleInstrumentsFetch } from "@hongpung/src/features/reservation/configureReservation/api/searchBorrowPossibleInstrumentsApi";
import { BorrowInstrumentsConfirmButton } from "@hongpung/src/features/reservation/configureReservation/ui/BorrowInstrumentsConfirmButton/BorrowInstrumentsConfirmButton";
import BorrowPossibleInstrumentList from "@hongpung/src/widgets/instrument/ui/BorrowPossibleInstrumentList/BorrowPossibleInstrumentList";

const CreateReservationInstrumentsSelectPage: React.FC = () => {
  const { data, isLoading } = useBorrowPossibleInstrumentsFetch();
  const { reservation, setBorrowInstruments } = useCreateReservation();

  const [newBorrowInstruments, setNewBorrowInstruments] = useState<
    Instrument[]
  >(reservation.borrowInstruments);

  const toggleInstrument = (instrument: Instrument) => {
    setNewBorrowInstruments((prev) =>
      prev.includes(instrument)
        ? prev.filter((i) => i !== instrument)
        : [...prev, instrument]
    );
  };

  return (
    <View style={styles.container}>
      <Header leftButton="close" headerName="대여 악기 선택" />

      <View style={styles.container}>
        <BorrowPossibleInstrumentList
          instrumentList={data ?? []}
          toggleInstrument={toggleInstrument}
          selectedInstruments={newBorrowInstruments}
          isLoading={isLoading}
        />
      </View>

      {reservation.borrowInstruments.length > 0 && (
        <BorrowInstrumentsConfirmButton
          borrowInstrumentsLength={newBorrowInstruments.length}
          onPress={() => {
            setBorrowInstruments(newBorrowInstruments);
          }}
        />
      )}
    </View>
  );
};

export default CreateReservationInstrumentsSelectPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  emptyText: {
    marginHorizontal: "auto",
    marginTop: 300,
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 18,
    color: Color["grey400"],
  },
});
