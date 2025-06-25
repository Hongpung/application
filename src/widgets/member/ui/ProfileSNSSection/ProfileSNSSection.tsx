import { View, Text, Pressable, StyleSheet } from "react-native";
import { Color } from "@hongpung/src/common";
import { Member } from "@hongpung/src/entities/member";

interface ProfileSNSSectionProps {
  editPersonalInfo: Member;
  setIsSnsAddressModalVisible: (visible: boolean) => void;
}

export const ProfileSNSSection: React.FC<ProfileSNSSectionProps> = ({
  editPersonalInfo,
  setIsSnsAddressModalVisible,
}) => {
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
        <Text style={styles.title}>SNS 주소</Text>
        <Pressable
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setIsSnsAddressModalVisible(true)}
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
      <View style={[styles.detailContainer, { gap: 12 }]}>
        <View style={{ gap: 8 }}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>인스타그램</Text>
            <Text
              style={[
                styles.detailValue,
                editPersonalInfo.instagramUrl
                  ? {}
                  : { color: Color["grey400"] },
              ]}
            >
              {editPersonalInfo.instagramUrl || "없음"}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>블로그</Text>
            <Text
              style={[
                styles.detailValue,
                editPersonalInfo.blogUrl ? {} : { color: Color["grey400"] },
              ]}
            >
              {editPersonalInfo.blogUrl || "없음"}
            </Text>
          </View>
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
