import { View, Pressable, Text, Image, StyleSheet } from "react-native";

import { Color } from "@hongpung/src/common";
import { Member } from "@hongpung/src/entities/member";
import React, { useState } from "react";
import { RoleTag } from "../RoleTag/RoleTag";
import { Skeleton } from "moti/skeleton";

interface MemberCardProps {
  member: Member;
  onPress: (user: Member) => void;
}
const MemberCard: React.FC<MemberCardProps> = ({ member, onPress }) => {
  const hasImage = !!member.profileImageUrl;
  const [isProfileImageLoading, setIsProfileImageLoading] = useState(true);

  return (
    <View style={styles.ProfileContainer}>
      <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
        <View style={styles.ProfilePhotoWrapper}>
          {hasImage ? (
            <>
              <Image
                source={{ uri: member.profileImageUrl }}
                style={styles.ProfilePhoto}
                onLoadEnd={() => setIsProfileImageLoading(false)}
              />
              {isProfileImageLoading && (
                <View style={styles.SkeletonOverlay}>
                  <Skeleton
                    transition={{
                      type: "spring",
                      duration: 400,
                      delay: 100,
                    }}
                    width={"100%"}
                    height={"100%"}
                    colors={[Color["grey100"], Color["grey300"]]}
                  />
                </View>
              )}
            </>
          ) : (
            <View
              style={[
                styles.ProfilePhoto,
                {
                  backgroundColor: Color["grey200"],
                },
              ]}
            />
          )}
        </View>

        {/* 텍스트 정보 */}
        <View style={{ height: 44, display: "flex", gap: 2 }}>
          <View
            style={[
              { flexDirection: "row", flex: 1, alignItems: "center" },
              member.nickname ? { marginTop: 3 } : null,
            ]}
          >
            <Text style={styles.UserName}>{member.name}</Text>
          </View>
          {member.nickname && (
            <Text style={styles.UserNickName}>{member.nickname}</Text>
          )}
        </View>
      </View>

      {/* 역할 태그 */}
      <View style={styles.RoleTagWrapper}>
        {member.role?.map((role) => (
          <RoleTag key={role} role={role} />
        ))}
      </View>

      {/* 더 알아보기 버튼 */}
      <Pressable style={styles.MoreButton} onPress={() => onPress(member)}>
        <Text style={styles.moreBtn}>{`더 알아보기 >`}</Text>
      </Pressable>
    </View>
  );
};

export default React.memo(MemberCard);

const styles = StyleSheet.create({
  ProfileContainer: {
    position: "relative",
    height: 112,
    borderRadius: 15,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: Color["grey200"],
  },
  ProfilePhoto: {
    width: 60,
    height: 80,
    borderRadius: 5,
    marginRight: 24,
  },
  instrumnetMark: {
    width: 24,
    height: 24,
    backgroundColor: Color["grey200"],
    marginRight: 4,
  },
  UserName: {
    fontSize: 16,
    color: Color["grey700"],
    fontFamily: "NanumSquareNeo-Bold",
    textAlign: "left",
  },
  UserNickName: {
    fontSize: 14,
    color: Color["grey400"],
    fontFamily: "NanumSquareNeo-Regular",
    textAlign: "left",
    marginTop: 4,
  },
  moreBtn: {
    fontSize: 12,
    color: Color["grey500"],
    fontFamily: "NanumSquareNeo-Light",
    textAlign: "right",
    marginTop: 4,
  },
  clubInfo: {
    fontSize: 12,
    color: Color["grey400"],
    fontFamily: "NanumSquareNeo-Bold",
    textAlign: "right",
    marginTop: 4,
  },
  ProfilePhotoWrapper: {
    position: "relative",
    width: 60,
    height: 80,
    marginLeft: 20,
    marginRight: 24,
  },
  SkeletonOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 5,
    overflow: "hidden",
  },
  RoleTagWrapper: {
    position: "absolute",
    left: 104,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  MoreButton: {
    position: "absolute",
    right: 16,
    bottom: 8,
    borderRadius: 200,
  },
});
