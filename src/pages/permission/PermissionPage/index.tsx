import usePermission from "@hongpung/src/features/permission/getPermissions/model/usePermission";
import PermissionButton from "@hongpung/src/features/permission/getPermissions/ui/PermissionButtron/PermissionButton";
import { View, Text, ScrollView, Platform, StyleSheet } from "react-native";
import { Color, Icons } from "@hongpung/src/common";

const PermissionPage: React.FC = () => {
  const { PermissionHandler } = usePermission();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>권한 동의</Text>
        <Text style={styles.description}>
          앱 사용시 필요한 권한에 대해 동의하는 단계에요.
        </Text>
      </View>
      {/* 저해상도 심사 반려 때문에 스크롤 적용 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.cardIcons}>
            <Icons name="camera-outline" size={48} color={Color["blue700"]} />
          </View>
          <View style={{ display: "flex", gap: 4 }}>
            <Text style={styles.cardHeaderWord}>카메라 사용 권한</Text>
            <Text style={styles.cardDescript}>
              {"- QR코드 인식\n- 이용 후 정리 확인"}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardIcons}>
            <Icons name="albums-outline" size={48} color={Color["blue700"]} />
          </View>
          <View style={{ display: "flex", gap: 4 }}>
            <Text style={styles.cardHeaderWord}>갤러리 사용 권한</Text>
            <Text style={styles.cardDescript}>
              {"- 프로필 이미지 등록\n- 악기 사진 등록"}
            </Text>
          </View>
        </View>
        {(Platform.OS === "ios" ||
          (Platform.OS === "android" && Platform.Version >= 33)) && (
          <View style={styles.card}>
            <View style={styles.cardIcons}>
              <Icons
                name="notifications-outline"
                size={48}
                color={Color["blue700"]}
              />
            </View>
            <View style={{ display: "flex", gap: 4 }}>
              <Text style={styles.cardHeaderWord}>알림 사용 권한</Text>
              <Text style={styles.cardDescript}>
                {"- 일정 알림\n- 공지사항 알림\n- 예약 알림"}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.CTA}>
        <PermissionButton onPress={PermissionHandler} />
      </View>
    </View>
  );
};

export default PermissionPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "NanumSquareNeo-Bold",
  },
  description: {
    color: Color["grey400"],
    fontSize: 14,
    height: 36,
    fontFamily: "NanumSquareNeo-Bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    gap: 24,
    paddingVertical: 48,
  },
  card: {
    backgroundColor: "#FFF",
    alignItems: "center",
    flexDirection: "row",
    gap: 24,
    paddingLeft: 24,
    paddingRight: 12,
    height: 118,
    borderWidth: 1,
    borderColor: Color["grey200"],
    borderRadius: 10,
  },
  cardIcons: {
    height: 48,
    width: 48,
  },
  cardHeaderWord: {
    fontFamily: "NanumSquareNeo-ExtraBold",
    color: Color["grey800"],
    fontSize: 18,
    lineHeight: 22,
  },
  cardDescript: {
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey400"],
    height: 48,
    fontSize: 12,
    lineHeight: 16,
  },
  CTA: {
    width: "100%",
    backgroundColor: "#FFF",
    paddingVertical: 32,
  },
});
