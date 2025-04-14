import React from "react";
import { Text, StyleSheet } from "react-native";
import { Color } from "@hongpung/src/common";

interface RoleTextProps {
  roles: string[];
  style?: object;
}

export const RoleText: React.FC<RoleTextProps> = ({ roles, style }) => {
  if (!roles || roles.length === 0) {
    return <Text style={[styles.defaultText, style]}>동아리원</Text>;
  }

  return (
    <>
      {roles.map((roleName, index) => (
        <React.Fragment key={roleName + index}>
          <Text
            style={[
              styles.roleText,
              { color: roleName === "상쇠" ? Color["red500"] : Color["blue500"] },
              style,
            ]}
          >
            {roleName}
          </Text>
          {index !== roles.length - 1 && <Text style={[styles.comma, style]}> </Text>}
        </React.Fragment>
      ))}
    </>
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
    fontFamily: "NanumSquareNeo-Bold",
  },
}); 