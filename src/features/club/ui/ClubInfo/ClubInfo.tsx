import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Color } from "@hongpung/src/common";
import { type ClubInfo } from "@hongpung/src/entities/club/model/type";

interface ClubInfoViewProps {
  info: ClubInfo;
}

export const ClubInfoView: React.FC<ClubInfoViewProps> = ({ info }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.clubName}>{info.club}</Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>회장</Text>
          <Text style={styles.infoValue}>
            {info.leader ? info.leader.name : "미정"}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>상소</Text>
          <Text style={styles.infoValue}>
            {info.sangsoe ? info.sangsoe.name : "미정"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Color["white"],
  },
  clubName: {
    fontSize: 24,
    color: Color["grey900"],
    fontFamily: "NanumSquareNeo-Bold",
    marginBottom: 16,
  },
  infoContainer: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 16,
    color: Color["grey700"],
    fontFamily: "NanumSquareNeo-Bold",
    width: 60,
  },
  infoValue: {
    fontSize: 16,
    color: Color["grey500"],
    fontFamily: "NanumSquareNeo-Regular",
  },
}); 