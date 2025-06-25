import { View, Text, Pressable, StyleSheet } from "react-native";
import { Color } from "@hongpung/src/common";
import {
  Member,
  RoleText,
  UserStatusState,
} from "@hongpung/src/entities/member";
import { useAtomValue } from "jotai";

interface ProfileInfoSectionProps {
  editPersonalInfo: Member;
  setIsPersonalInfoModalVisible: (visible: boolean) => void;
}

export const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  editPersonalInfo,
  setIsPersonalInfoModalVisible,
}) => {
  const loginUser = useAtomValue(UserStatusState);
  if (!loginUser) {
    return null;
  }
  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Text style={styles.title}>개인정보</Text>
        <Pressable
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setIsPersonalInfoModalVisible(true)}
        >
          <Text
            style={{
              fontSize: 14,
              borderRadius: 8,
              padding: 8,
              backgroundColor: Color["grey200"],
              color: Color["grey400"],
              fontFamily: "NanumSquareNeo-Bold",
            }}
          >
            수정
          </Text>
        </Pressable>
      </View>
      <View style={[styles.detailContainer, { gap: 8 }]}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>이메일</Text>
          <Text style={styles.detailValue}>{loginUser.email}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>이름</Text>
          <Text style={styles.detailValue}>{loginUser.name}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>패명</Text>
          <Text
            style={[
              styles.detailValue,
              editPersonalInfo.nickname ? {} : { color: Color["grey400"] },
            ]}
          >
            {editPersonalInfo.nickname || "-"}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>동아리(학번)</Text>
          <Text style={styles.detailValue}>
            {`${loginUser.club}` + ` (${editPersonalInfo.enrollmentNumber})`}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>역할</Text>
          <RoleText roles={loginUser.role} style={styles.detailValue} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey400"],
    textAlign: "left",
  },
  detailContainer: {
    paddingHorizontal: 16,
    marginHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 16,
    color: Color["grey400"],
    fontFamily: "NanumSquareNeo-Light",
    textAlign: "left",
  },
  detailValue: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Regular",
    textAlign: "right",
  },
});
