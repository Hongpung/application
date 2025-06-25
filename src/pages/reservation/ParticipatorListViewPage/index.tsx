import React from "react";
import { View, StyleSheet } from "react-native";

import { Header } from "@hongpung/src/common";
import { MainStackScreenProps } from "@hongpung/src/common/navigation";

import type { Member } from "@hongpung/src/entities/member";

import { ParticipatorList } from "@hongpung/src/widgets/member";

const ParticipatorListViewPage: React.FC<
  MainStackScreenProps<"ParticipatorList">
> = ({ route }) => {
  const { participators: participatorData } = route.params;
  const participators = (JSON.parse(participatorData) as Member[]).sort(
    (a, b) => Number(a.enrollmentNumber) - Number(b.enrollmentNumber),
  );

  return (
    <View style={styles.container}>
      <Header LeftButton={"close"} headerName="참여 인원 목록" />
      <View style={styles.scrollContainer}>
        <ParticipatorList members={participators} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    backgroundColor: "#fff",
    flex: 1,
    marginVertical: 8,
    marginHorizontal: 24,
  },
});

export default ParticipatorListViewPage;
