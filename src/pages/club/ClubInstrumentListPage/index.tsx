import React from "react";
import { View, StyleSheet } from "react-native";
import { type Instrument } from "@hongpung/src/entities/instrument";
import { Header } from "@hongpung/src/common";
import InstrumentViewList from "@hongpung/src/widgets/instrument/ui/InstrumentViewList/InstrumentViewList";
import { useLoadClubInstrumentsFetch } from "@hongpung/src/entities/club";
import { ClubStackProps } from "@hongpung/src/common/navigation";

const ClubInstrumentListPage: React.FC<ClubStackProps<"ClubInstruments">> = ({
  navigation,
}) => {
  const {
    data: instrumentList,
    isLoading,
    error,
  } = useLoadClubInstrumentsFetch();

  const handleInstrumentClick = (instrument: Instrument) => {
    navigation.push("InstrumentDetail", {
      instrumentId: instrument.instrumentId,
    });
  };

  return (
    <View style={styles.container}>
      <Header leftButton="close" headerName="악기 목록" />
      <InstrumentViewList
        instrumentList={instrumentList ? instrumentList : []}
        isLoading={isLoading}
        onInstrumentClick={handleInstrumentClick}
      />
    </View>
  );
};

export default ClubInstrumentListPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
