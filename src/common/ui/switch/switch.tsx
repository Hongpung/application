import { Animated, View, StyleSheet, Pressable } from "react-native";
import React, { useCallback, useRef } from "react";

import { Color } from "../../constant/color";

export const Switch: React.FC<{
  onChange: (value: boolean) => void;
  value: boolean;
}> = ({ onChange, value }) => {
  const translateX = useRef(new Animated.Value(value ? 40 : 0)).current;
  const width = useRef(new Animated.Value(36)).current;

  const onPressHandler = useCallback(() => {
    Animated.timing(translateX, {
      toValue: value ? -40 : 40,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      onChange(!value);
    });
  }, [value, onChange, translateX]);

  return (
    <Pressable style={{ flexDirection: "row" }} onPress={onPressHandler}>
      <View style={styles.switchContainer}>
        <View
          style={[
            styles.switchBackground,
            { backgroundColor: value ? Color["blue400"] : Color["grey300"] },
          ]}
        />
        <Animated.View
          style={[
            styles.switchHandle,
            { width },
            value
              ? {
                  transform: [
                    {
                      translateX: translateX.interpolate({
                        inputRange: [-40, 0],
                        outputRange: [4, 40],
                        extrapolate: "clamp",
                      }),
                    },
                  ],
                }
              : {
                  transform: [
                    {
                      translateX: translateX.interpolate({
                        inputRange: [0, 40],
                        outputRange: [4, 40],
                        extrapolate: "clamp",
                      }),
                    },
                  ],
                },
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 80,
    height: 42,
    borderRadius: 20,
    justifyContent: "center",
  },
  switchBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  switchHandle: {
    position: "absolute",
    height: 36,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderColor: Color["grey200"],
    borderWidth: 1,
  },
});
