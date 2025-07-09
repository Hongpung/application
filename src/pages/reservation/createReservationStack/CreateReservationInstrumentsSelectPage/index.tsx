import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { Header, Color } from "@hongpung/src/common";
import { Instrument } from "@hongpung/src/entities/instrument";
import { useBorrowPossibleInstrumentsFetch } from "@hongpung/src/entities/reservation";

import { useCreateReservation } from "@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context";
import { BorrowInstrumentsConfirmButton } from "@hongpung/src/widgets/reservation/ui/BorrowInstrumentsConfirmButton/BorrowInstrumentsConfirmButton";

import BorrowPossibleInstrumentList from "@hongpung/src/widgets/instrument/ui/BorrowPossibleInstrumentList/BorrowPossibleInstrumentList";

const CreateReservationBorrowInstrumentsSelectScreen: React.FC = () => {
  const { data, isLoading } = useBorrowPossibleInstrumentsFetch();
  const { reservation, setBorrowInstruments } = useCreateReservation();

  const [newBorrowInstruments, setNewBorrowInstruments] = useState<
    Instrument[]
  >(reservation.borrowInstruments);

  const toggleInstrument = (instrument: Instrument) => {
    setNewBorrowInstruments((prev) =>
      prev.includes(instrument)
        ? prev.filter((i) => i !== instrument)
        : [...prev, instrument],
    );
  };

  return (
    <View style={styles.container}>
      <Header LeftButton="close" headerName="대여 악기 선택" />

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

export default CreateReservationBorrowInstrumentsSelectScreen;

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
