import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Color } from "@hongpung/src/common";

interface RoleTagProps {
  role: string;
}

export const RoleTag: React.FC<RoleTagProps> = ({ role }) => {
  const isSangsoe = role === "상쇠";

  return (
    <View>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isSangsoe ? Color["red100"] : Color["blue100"],
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color: isSangsoe ? Color["red600"] : Color["blue600"],
            },
          ]}
        >
          {role}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderRadius: 5,
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontFamily: "NanumSquareNeo-Bold",
  },
});
