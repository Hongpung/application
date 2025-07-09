import React, { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";

import { Instrument } from "@hongpung/src/entities/instrument";
import { Header, Color } from "@hongpung/src/common";

import { useBorrowPossibleInstrumentsFetch } from "@hongpung/src/entities/reservation";
import { BorrowInstrumentsConfirmButton } from "@hongpung/src/widgets/reservation/ui/BorrowInstrumentsConfirmButton/BorrowInstrumentsConfirmButton";
import BorrowPossibleInstrumentList from "@hongpung/src/widgets/instrument/ui/BorrowPossibleInstrumentList/BorrowPossibleInstrumentList";
import { useEditReservation } from "@hongpung/src/features/reservation/editReservation/model/useEditReservation.context";
import { EditReservationStackScreenProps } from "@hongpung/src/common/navigation";

const BorrowInstrumentSelectScreen: React.FC<
  EditReservationStackScreenProps<"EditReservationBorrowInstrumentsSelect">
> = ({ navigation }) => {
  const { data, isLoading } = useBorrowPossibleInstrumentsFetch();
  const { reservation, setBorrowInstruments } = useEditReservation();
  const [newBorrowInstruments, setNewBorrowInstruments] = useState<
    Instrument[]
  >(reservation.borrowInstruments);

  const toggleInstrument = (instrument: Instrument) => {
    if (newBorrowInstruments.includes(instrument)) {
      setNewBorrowInstruments((prev) => prev.filter((i) => i !== instrument));
    } else {
      setNewBorrowInstruments((prev) => [...prev, instrument]);
    }
  };

  const onPressConfirm = useCallback(() => {
    setBorrowInstruments(newBorrowInstruments);
    navigation.goBack();
  }, [newBorrowInstruments, navigation, setBorrowInstruments]);

  return (
    <View style={styles.container}>
      <Header LeftButton="close" headerName="대여 악기 선택" />

      <View style={styles.container}>
        <BorrowPossibleInstrumentList
          instrumentList={data}
          toggleInstrument={toggleInstrument}
          isLoading={isLoading}
          selectedInstruments={newBorrowInstruments}
        />
      </View>

      {reservation.borrowInstruments.length > 0 && (
        <BorrowInstrumentsConfirmButton
          borrowInstrumentsLength={newBorrowInstruments.length}
          onPress={onPressConfirm}
        />
      )}
    </View>
  );
};

export default BorrowInstrumentSelectScreen;

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
