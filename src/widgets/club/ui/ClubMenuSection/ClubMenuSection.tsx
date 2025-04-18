import { View, Text, Pressable, StyleSheet } from "react-native";
import { Color } from "@hongpung/src/common";
import { Icons } from "@hongpung/src/common/ui/Icons/Icons";
import { CLUB_MENUS } from "@hongpung/src/entities/club/constant/clubMenus";
import { ClubStackParamList } from "@hongpung/src/navigation/ClubStackNavigation";

interface ClubMenuSectionProps {
  onMenuPress: (link: keyof ClubStackParamList) => void;
}

export const ClubMenuSection: React.FC<ClubMenuSectionProps> = ({
  onMenuPress,
}) => {
  return (
    <View style={{ gap: 4, paddingVertical: 24 }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>동아리 관리</Text>
      </View>

      {CLUB_MENUS.map((menu, index) => (
        <Pressable
          key={menu.name + index}
          style={styles.menuItem}
          onPress={() => onMenuPress(menu.link)}
        >
          <Text style={styles.menuTitle}>{menu.name}</Text>
          <Icons size={20} name="chevron-forward" color={Color["grey400"]} />
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    marginHorizontal: 24,
    flexDirection: "row",
    height: 20,
    alignSelf: "flex-start",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: Color["grey700"],
    fontFamily: "NanumSquareNeo-Bold",
    textAlign: "left",
  },
  menuItem: {
    marginHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  menuTitle: {
    fontSize: 16,
    color: Color["grey500"],
    fontFamily: "NanumSquareNeo-Regular",
    textAlign: "left",
  },
}); 