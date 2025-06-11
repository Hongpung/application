import { View, Text, StyleSheet } from "react-native";

import { Color, ImageWithSkeleton } from "@hongpung/src/common";

import { useLoadMyStatusFetch } from "@hongpung/src/entities/member";

import { useLoadClubInfoSuspenseFetch } from "@hongpung/src/entities/club/api/clubApi";

export const ClubProfileSection: React.FC = () => {
  const { data: loginUser } = useLoadMyStatusFetch();
  const { data } = useLoadClubInfoSuspenseFetch();
  const { profileImageUrl, roleData } = data;

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        {profileImageUrl ? (
          <ImageWithSkeleton
            imageSource={{ uri: profileImageUrl }}
            style={styles.profileImage}
            cachePolicy="memory-disk"
            contentFit="cover"
          />
        ) : (
          <View style={styles.profileImagePlaceholder} />
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.info}>
          <Text style={styles.infoLabel}>동아리</Text>
          <Text style={styles.infoValue}>{loginUser?.club}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoLabel}>패짱</Text>
          <Text style={styles.infoValue}>
            {roleData && roleData.length > 0 && roleData[0].member
              ? `${roleData[0].member.name}${
                  roleData[0].member.nickname
                    ? ` (${roleData[0].member.nickname})`
                    : ""
                }`
              : "공석"}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoLabel}>상쇠</Text>
          <Text style={styles.infoValue}>
            {roleData && roleData.length > 1 && roleData[1].member
              ? `${roleData[1].member.name}${
                  roleData[1].member.nickname
                    ? ` (${roleData[1].member.nickname})`
                    : ""
                }`
              : "공석"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
  },
  profileImageContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 25,
    backgroundColor: Color["grey100"],
    borderColor: Color["grey200"],
    borderWidth: 1,
    overflow: "hidden",
  },
  profileImagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 25,
    backgroundColor: Color["grey100"],
    borderColor: Color["grey200"],
    borderWidth: 1,
  },
  infoContainer: {
    gap: 24,
    paddingVertical: 4,
  },
  info: {
    marginHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 16,
    color: Color["grey400"],
    fontFamily: "NanumSquareNeo-Regular",
    textAlign: "left",
  },
  infoValue: {
    fontSize: 16,
    color: Color["grey700"],
    fontFamily: "NanumSquareNeo-Regular",
    textAlign: "right",
  },
});
