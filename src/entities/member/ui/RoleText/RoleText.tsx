import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Color } from "@hongpung/src/common";

interface RoleTextProps {
  roles: string[];
  style?: object;
}

export const RoleText: React.FC<RoleTextProps> = ({ roles, style }) => {
  const rolesLength = roles ? roles.length : 0;

  if (!roles || rolesLength === 0) {
    return <Text style={[styles.defaultText, style]}>동아리원</Text>;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      {roles.map((roleName, index) => (
        <React.Fragment key={roleName + index}>
          <Text
            style={[
              styles.roleText,
              {
                color: roleName === "상쇠" ? Color["red500"] : Color["blue500"],
              },
              style,
            ]}
          >
            {roleName}
          </Text>
          {index !== rolesLength - 1 && (
            <Text style={[styles.comma, style]}>{","}</Text>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Regular",
  },
  roleText: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
  },
  comma: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Regular",
    paddingRight: 4,
  },
});
