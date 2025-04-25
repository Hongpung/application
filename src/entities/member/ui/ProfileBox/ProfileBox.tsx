import React from "react";
import { View, Text, Image, StyleSheet, Pressable, Linking } from "react-native";
import { Color } from "@hongpung/src/common";
import { Icons } from "@hongpung/src/common";
import { type Member } from "@hongpung/src/entities/member/model/type";
import { RoleText } from "../RoleText/RoleText";

interface ProfileBoxProps {
  member: Member;
}

export const ProfileBox: React.FC<ProfileBoxProps> = ({ member }) => {
    
  if (!member) return null;

  console.log(member)
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {member.profileImageUrl ? (
          <Image source={{ uri: member.profileImageUrl }} style={styles.profilePhoto} />
        ) : (
          <View style={[styles.profilePhoto, styles.profilePhotoPlaceholder]} />
        )}

        <View style={styles.infoContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{member.name}</Text>
            {member?.nickname && (
              <Text style={styles.nickname}>{member?.nickname}</Text>
            )}
          </View>

          <View style={styles.socialContainer}>
            {member?.instagramUrl && (
              <Pressable
                style={styles.icon}
                onPress={() => {
                  Linking.openURL("https://www.instagram.com/" + member.instagramUrl).catch(
                    (err) => {
                      console.error("Failed to open URL:", err);
                    }
                  );
                }}
              >
                <Icons name="logo-instagram" size={24} color={Color["grey400"]} />
              </Pressable>
            )}

            {member?.blogUrl && (
              <Pressable
                style={styles.icon}
                onPress={() => {
                  Linking.openURL("https://blog.naver.com/" + member.blogUrl).catch(
                    (err) => {
                      console.error("Failed to open URL:", err);
                    }
                  );
                }}
              >
                <Icons name="chatbox" size={24} color={Color["green500"]} />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      <View style={styles.detailContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>동아리(학번)</Text>
          <Text style={styles.detailValue}>
            {`${member.club}` + ` (${member.enrollmentNumber})`}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>역할</Text>
          <RoleText roles={member.role} style={styles.detailValue} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: 36,
    gap: 24,
    marginVertical: 16,
  },
  profileContainer: {
    flexDirection: "row",
    flex: 1,
  },
  profilePhoto: {
    width: 90,
    height: 120,
    borderRadius: 5,
    marginRight: 16,
    alignSelf:'center'
  },
  profilePhotoPlaceholder: {
    backgroundColor: Color["grey200"],
    borderWidth: 1,
    borderColor: Color["grey300"],
  },
  infoContainer: {
    flexDirection: "column",
    flex: 1,
    height: 120,
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  nameContainer: {
    display: "flex",
    gap: 4,
  },
  name: {
    fontSize: 16,
    color: Color["grey700"],
    fontFamily: "NanumSquareNeo-Regular",
    textAlign: "left",
  },
  nickname: {
    fontSize: 14,
    color: Color["grey400"],
    fontFamily: "NanumSquareNeo-Regular",
    textAlign: "left",
  },
  socialContainer: {
    flexDirection: "row",
    width: 64,
    justifyContent: "flex-start",
    gap: 4,
  },
  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
  },
  detailContainer: {
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 16,
    color: Color["grey400"],
    fontFamily: "NanumSquareNeo-Regular",
    textAlign: "left",
  },
  detailValue: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
    textAlign: "right",
  },
}); 