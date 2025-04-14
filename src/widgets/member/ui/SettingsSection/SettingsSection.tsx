import { View, Text, Pressable, StyleSheet } from "react-native";
import { Color } from "@hongpung/src/common";
import { Icons } from "@hongpung/src/common/ui/Icons/Icons";
import { SETTING_MENUS } from "../../../../entities/member/constants/settingSubMenu";

interface SettingsSectionProps {
  onPress: (link: string) => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>내 설정</Text>
      </View>
      <View style={styles.menuContainer}>
        {SETTING_MENUS.map((subMenu, index) => (
          <Pressable
            key={subMenu.name + index}
            style={styles.menuItem}
            onPress={() => onPress(subMenu.link)}
          >
            <Text style={styles.menuTitle}>{subMenu.name}</Text>
            <Icons size={20} name="chevron-forward" color={Color["grey400"]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    flexDirection: "row",
    height: 20,
    justifyContent: "flex-start",
    marginHorizontal: 24,
  },
  title: {
    fontSize: 18,
    color: Color["grey700"],
    fontFamily: "NanumSquareNeo-Bold",
    textAlign: "left",
  },
  menuContainer: {
    gap: 4,
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