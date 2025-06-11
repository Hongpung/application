import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";

import {
  Color,
  ImageModal,
  ImageWithSkeleton,
  Icons,
} from "@hongpung/src/common";
import { type Member } from "@hongpung/src/entities/member/model/type";
import { RoleText } from "../RoleText/RoleText";

interface ProfileBoxProps {
  member: Member;
}

export const ProfileBox: React.FC<ProfileBoxProps> = ({ member }) => {
  const hasImage = !!member.profileImageUrl;
  const [imageModalVisible, setImageModalVisible] = useState(false);
  return (
    <>
      {hasImage && imageModalVisible && (
        <ImageModal
          isVisible={imageModalVisible}
          setIsVisible={setImageModalVisible}
          imageUrl={member.profileImageUrl!}
        />
      )}
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          {hasImage ? (
            <Pressable onPress={() => setImageModalVisible(true)}>
              <ImageWithSkeleton
                imageSource={{ uri: member.profileImageUrl }}
                style={styles.profilePhoto}
                cachePolicy="memory-disk"
                contentFit="cover"
              />
            </Pressable>
          ) : (
            <View
              style={[styles.profilePhoto, styles.profilePhotoPlaceholder]}
            />
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
                    Linking.openURL(
                      "https://www.instagram.com/" + member.instagramUrl,
                    ).catch((err) => {
                      console.error("Failed to open URL:", err);
                    });
                  }}
                >
                  <Icons
                    name="logo-instagram"
                    size={24}
                    color={Color["grey400"]}
                  />
                </Pressable>
              )}

              {member?.blogUrl && (
                <Pressable
                  style={styles.icon}
                  onPress={() => {
                    Linking.openURL(
                      "https://blog.naver.com/" + member.blogUrl,
                    ).catch((err) => {
                      console.error("Failed to open URL:", err);
                    });
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: 32,
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
    borderRadius: 10,
    marginRight: 24,
    position: "relative",
    overflow: "hidden",
  },
  profilePhotoPlaceholder: {
    backgroundColor: Color["grey200"],
  },
  SkeletonOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 5,
    overflow: "hidden",
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
