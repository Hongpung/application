import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Color } from "@hongpung/src/common";
import { type ClubInfo } from "@hongpung/src/entities/club/model/type";

interface ClubInfoViewProps {
  clubName: ClubName;
  roleData: ClubInfo["roleData"];
}

export const ClubInfoView: React.FC<ClubInfoViewProps> = ({
  clubName,
  roleData,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.clubName}>{clubName}</Text>
      <View style={styles.infoContainer}>
        {roleData.map((role) => (
          <View style={styles.infoItem} key={role.role}>
            <Text style={styles.infoLabel}>{role.role}</Text>
            <Text style={styles.infoValue}>
              {role.member ? role.member.name : "미정"}
            </Text>
          </View>
        ))}
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
