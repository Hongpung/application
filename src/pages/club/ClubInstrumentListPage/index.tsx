import React from "react";
import { View, StyleSheet } from "react-native";
import { type Instrument } from "@hongpung/src/entities/instrument";
import Header from "@hongpung/src/common/ui/Header/Header";
import InstrumentViewList from "@hongpung/src/widgets/instrument/ui/InstrumentViewList/InstrumentViewList";
import { useLoadClubInstrumentsFetch } from "@hongpung/src/features/club/manageInstrument/api/useLoadClubInstruments";

const ClubInstrumentListPage: React.FC<ClubStackProps<"ClubInstruments">> = ({
  navigation,
  route,
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
      <Header leftButton="close" HeaderName="악기 목록" />
      <View style={styles.content}>
        <InstrumentViewList
          instrumentList={instrumentList || []}
          onInstrumentClick={handleInstrumentClick}
        />
      </View>
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
