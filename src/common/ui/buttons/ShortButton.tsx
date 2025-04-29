import { StyleSheet, Text, Pressable } from "react-native";
import React from "react";
import { Color } from "../../constant/color";

type ShortButtonProps = {
  innerContent: string;
  onPress: () => void;
  isFilled: boolean;
  color: string;
};

export const ShortButton: React.FC<ShortButtonProps> = React.memo(
  ({ innerContent, onPress, isFilled, color }) => {
    const colorKey: string = `${color}500`;
    const subColor: string = `${color}100`;
    return (
      <Pressable
        style={[
          styles.basic,
          {
            backgroundColor: isFilled ? Color[colorKey] : Color[subColor],
            borderColor: Color[colorKey],
          },
        ]}
        onPress={() => onPress()}
      >
        <Text
          style={[
            styles.basicText,
            { color: !isFilled ? Color[colorKey] : "white" },
          ]}
        >
          {innerContent}
        </Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  basic: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: 148,
  },
  basicText: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
  },
});
