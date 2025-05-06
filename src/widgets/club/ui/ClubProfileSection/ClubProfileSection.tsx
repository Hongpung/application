import { View, Text, Image, StyleSheet } from "react-native";

import { Color } from "@hongpung/src/common";

import { Member } from "@hongpung/src/entities/member/@x/club";

import { ClubProfileSectionSkeleton } from "../ClubProfileSectionSkeleton/ClubProfileSectionSkeleton";

type ClubProfileProps =
  | {
      profileImageUrl: null;
      clubName?: Exclude<ClubName, "기타">;
      roleData: null;
      isLoading: true;
    }
  | {
      profileImageUrl: string | null;
      clubName: Exclude<ClubName, "기타">;
      roleData: [
        { role: "패짱"; member: Member | null },
        { role: "상쇠"; member: Member | null }
      ];
      isLoading: false;
    };

export const ClubProfileSection: React.FC<ClubProfileProps> = ({
  profileImageUrl,
  clubName,
  roleData,
  isLoading,
}) => {


  if (isLoading && roleData === null) {
    return (
      <ClubProfileSectionSkeleton/>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        {profileImageUrl ? (
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profileImagePlaceholder} />
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.info}>
          <Text style={styles.infoLabel}>동아리</Text>
          <Text style={styles.infoValue}>{clubName}</Text>
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
