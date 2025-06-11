import { StyleSheet, Text, Pressable } from "react-native";
import React from "react";
import { Color } from "../../constant/color";

type ShortButtonProps = {
  innerContent: string | React.ReactNode;
  isAble?: boolean;
  onPress: () => void;
  isFilled: boolean;
  color: string;
};

export const ShortButton: React.FC<ShortButtonProps> = React.memo(
  ({ innerContent, onPress, isFilled, color, isAble = true }) => {
    const colorKey: string = `${color}500`;
    const subColor: string = `${color}100`;
    return (
      <Pressable
        style={[
          styles.basic,
          {
            backgroundColor: isFilled ? Color[colorKey] : Color[subColor],
            opacity: isFilled ? (isAble ? 1 : 0.5) : 0.75,
            borderColor: Color[colorKey],
          },
        ]}
        onPress={() => {
          if (isAble) {
            onPress();
          }
        }}
      >
        {typeof innerContent === "string" ? (
          <Text
            style={[
              styles.basicText,
              { color: isFilled ? "#FFF" : Color[colorKey] },
            ]}
          >
            {innerContent}
          </Text>
        ) : (
          innerContent
        )}
      </Pressable>
    );
  },
);

ShortButton.displayName = "ShortButton";

const styles = StyleSheet.create({
  basic: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    flexGrow: 1,
    flexShrink: 0,
    minWidth: 100,
  },
  basicText: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
  },
});
