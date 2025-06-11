import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Color, Icons } from "@hongpung/src/common";
import type { SubMenu } from "@hongpung/src/common";
import { ClubParamList } from "@hongpung/src/common/navigation";

interface ClubMenuProps {
  menus: SubMenu<ClubParamList>[];
  onMenuPress: (link: keyof ClubParamList) => void;
}

export const ClubMenu: React.FC<ClubMenuProps> = ({ menus, onMenuPress }) => {
  return (
    <View style={{ gap: 4, paddingVertical: 24 }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>동아리 관리</Text>
      </View>

      {menus.map((menu, index) => (
        <Pressable
          key={menu.name + index}
          style={styles.subMenu}
          onPress={() => onMenuPress(menu.link)}
        >
          <Text style={styles.subMenuTitle}>{menu.name}</Text>
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
  subMenu: {
    marginHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  subMenuTitle: {
    fontSize: 16,
    color: Color["grey500"],
    fontFamily: "NanumSquareNeo-Regular",
    textAlign: "left",
  },
});
