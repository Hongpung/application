import React from "react";
import { View, StyleSheet } from "react-native";
import { type Instrument } from "@hongpung/src/entities/instrument";
import { Header } from "@hongpung/src/common";
import BorrowInstrumentList from "@hongpung/src/widgets/instrument/ui/BorrowInstrumentList/BorrowInstrumentList";
import { StackActions } from "@react-navigation/native";
import { MainStackScreenProps } from "@hongpung/src/common/navigation";
import { debounce } from "lodash";

export const BorrowInstrumentListPage: React.FC<
  MainStackScreenProps<"BorrowInstrumentList">
> = ({ navigation, route }) => {
  const { borrowInstruments } = route.params;
  const instrumentList: Instrument[] = JSON.parse(borrowInstruments);

  const handleInstrumentClick = debounce(
    (instrument: Instrument) => {
      // Handle instrument click
      navigation.dispatch(
        StackActions.push("InstrumentDetail", {
          instrumentId: instrument.instrumentId,
        }),
      );
    },
    200,
    {
      leading: true,
      trailing: false,
    },
  );

  return (
    <View style={styles.container}>
      <Header LeftButton={"close"} headerName="대여 악기 목록" />
      <View style={styles.content}>
        <BorrowInstrumentList
          instrumentList={instrumentList}
          navigateToInstrumentDetail={handleInstrumentClick}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
