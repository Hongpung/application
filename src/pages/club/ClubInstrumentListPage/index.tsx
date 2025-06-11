import React from "react";
import { View, StyleSheet } from "react-native";
import { type Instrument } from "@hongpung/src/entities/instrument";
import { Header } from "@hongpung/src/common";
import InstrumentViewList from "@hongpung/src/widgets/instrument/ui/InstrumentViewList/InstrumentViewList";
import { useLoadClubInstrumentsFetch } from "@hongpung/src/entities/club";
import { ClubStackProps } from "@hongpung/src/common/navigation";
import { debounce } from "lodash";

const ClubInstrumentListPage: React.FC<ClubStackProps<"ClubInstruments">> = ({
  navigation,
}) => {
  const { data: instrumentList, isLoading } = useLoadClubInstrumentsFetch();

  const handleInstrumentClick = debounce(
    (instrument: Instrument) => {
      navigation.push("InstrumentDetail", {
        instrumentId: instrument.instrumentId,
      });
    },
    500,
    {
      leading: true,
      trailing: false,
    },
  );

  const navigateToCreateInstrument = debounce(
    () => {
      navigation.push("CreateInstrument");
    },
    500,
    {
      leading: true,
      trailing: false,
    },
  );

  return (
    <View style={styles.container}>
      <Header
        LeftButton="close"
        headerName="악기 목록"
        RightButton="생성"
        rightAction={navigateToCreateInstrument}
      />
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
