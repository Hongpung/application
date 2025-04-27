import { View, Pressable, Text } from "react-native";
import { Color } from "../../config/color.config";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

interface MainFooterProps {
  navigateToServiceTerms: () => void;
  navigateToPrivacyPolicy: () => void;
}

const MainFooter: React.FC<MainFooterProps> = ({
  navigateToServiceTerms,
  navigateToPrivacyPolicy,
}) => {
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <View
      style={[
        {
          paddingHorizontal: 24,
          backgroundColor: Color["grey100"],
          flexDirection: "column",
          gap: 28,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingVertical: 16,
          paddingBottom: tabBarHeight + 16,
        },
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 48, paddingBottom:12 }}>
        <Pressable style={{ flex: 1 }} onPress={navigateToServiceTerms}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "NanumSquareNeo-Regular",
              fontSize: 14,
              color: Color["grey400"],
            }}
          >
            이용 약관
          </Text>
        </Pressable>
        <Pressable style={{ flex: 1 }} onPress={navigateToPrivacyPolicy}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "NanumSquareNeo-Regular",
              fontSize: 14,
              color: Color["grey400"],
            }}
          >
            개인정보 처리 방침
          </Text>
        </Pressable>
      </View>
      <View style={{ gap: 6 }}>
        <Text
          style={{
            fontFamily: "NanumSquareNeo-Regular",
            fontSize: 12,
            color: Color["grey400"],
          }}
        >
          기타 문의
        </Text>
        <View style={{ gap: 4 }}>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Regular",
              fontSize: 12,
              color: Color["grey400"],
            }}
          >
            대표자: 강윤호 (산틀 18)
          </Text>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Regular",
              fontSize: 12,
              color: Color["grey400"],
            }}
          >
            전화번호: 010-5034-2854
          </Text>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Regular",
              fontSize: 12,
              color: Color["grey400"],
            }}
          >
            이메일: ajtwoddl1236@naver.com
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MainFooter;
