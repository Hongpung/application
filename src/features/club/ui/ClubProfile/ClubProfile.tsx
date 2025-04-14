import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Color } from "@hongpung/src/common";
import { type ClubProfile as ClubProfileType } from "@hongpung/src/entities/club/model/type";

interface ClubProfileProps {
  profile: ClubProfileType;
}

export const ClubProfile: React.FC<ClubProfileProps> = ({ profile }) => {
    
  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        {profile.profileImageUrl ? (
          <Image
            source={{ uri: profile.profileImageUrl }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profileImagePlaceholder} />
        )}
      </View>

      <View style={styles.roleContainer}>
        {profile.roleData.map((role, index) => (
          <View key={role.role + index} style={styles.roleItem}>
            <Text style={styles.roleTitle}>{role.role}</Text>
            <Text style={styles.roleName}>{role.member.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Color["white"],
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    marginRight: 16,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: Color["grey200"],
  },
  roleContainer: {
    flex: 1,
    gap: 8,
  },
  roleItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleTitle: {
    fontSize: 16,
    color: Color["grey700"],
    fontFamily: "NanumSquareNeo-Bold",
    marginRight: 8,
  },
  roleName: {
    fontSize: 16,
    color: Color["grey500"],
    fontFamily: "NanumSquareNeo-Regular",
  },
}); 