import { Color, Icons, ValidationState } from "@hongpung/src/common";
import { useRef, useEffect } from "react";
import { Animated, Pressable, View, Text, StyleSheet } from "react-native";

interface SelectorLabelProps {
  value?: string | null;
  validation: ValidationState;
  onPress?: () => void;
}

export const ClubSelectorLabel: React.FC<SelectorLabelProps> = ({
  value,
  validation,
  onPress,
}) => {
  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current; // 초기 값 설정
  const labelStyle = {
    fontSize: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 10],
    }),
    top: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [5, 3],
    }),
  };

  useEffect(() => {
    Animated.timing(labelAnimation, {
      toValue: value ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [value, labelAnimation]);

  return (
    <Pressable style={{ width: "100%" }} onPress={onPress}>
      <Animated.Text style={[styles.labelText, labelStyle]}>
        동아리
        <Text style={{ color: "red" }}>*</Text>
      </Animated.Text>

      <Text
        key={"동아리"}
        style={[
          styles.InputBox,
          {
            borderBottomWidth: 1,
            borderBottomColor: validation.state === "ERROR" ? Color["red500"] : Color["green500"],
            color: value ? Color["grey800"] : Color["grey400"],
          },
        ]}
      >
        {value || "동아리 선택"}
      </Text>

      <View style={[styles.SelectBtn]}>
        <Icons name={"caret-down"} color={Color["green500"]} size={24}></Icons>
      </View>
      {validation.state === "ERROR" && <Text style={styles.errorText}>{validation.errorText}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  InputBox: {
    color: Color["grey800"],
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Regular",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  labelText: {
    color: Color["grey800"],
    fontSize: 10,
    fontFamily: "NanumSquareNeo-Bold",
    height: 20,
  },
  errorText: {
    position: "absolute",
    top: "100%",
    color: Color["red500"],
    fontFamily: "NanumSquareNeo-Bold",
    paddingTop: 8,
    paddingHorizontal: 4,
    fontSize: 12,
  },
  SelectBtn: {
    position: "absolute",
    right: 4,
    top: 24,
    width: 32,
    height: 32,
  },
});
