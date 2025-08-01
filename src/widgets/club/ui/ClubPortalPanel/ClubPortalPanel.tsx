import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

import { useAtomValue } from "jotai";

import { Color } from "@hongpung/src/common";
import { UserStatusState } from "@hongpung/src/entities/member";

interface ClubPortalPanelProps {
  navigateToClubHome: () => void;
}

export const ClubPortalPanel: React.FC<ClubPortalPanelProps> = ({
  navigateToClubHome,
}) => {
  const loginUser = useAtomValue(UserStatusState);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.container}
      onPress={navigateToClubHome}
    >
      <Image
        source={require("@hongpung/assets/images/ClubBanner.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: 120,
          top: 0,
          right: 0,
        }}
        cachePolicy="memory-disk"
      />
      <Text style={styles.title}>우리 동아리</Text>
      <View style={styles.clubNameContainer}>
        <Text style={styles.clubName}>{loginUser?.club}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    backgroundColor: "#FFF",
    borderColor: Color["grey200"],
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    overflow: "hidden",
    position: "relative",
  },
  title: {
    fontSize: 18,
    fontFamily: "NanumSquareNeo-Bold",
  },
  clubNameContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    zIndex: 1,
  },
  clubName: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey400"],
  },
});
