import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { ComponentProps } from "react";
import { useNavigation } from "@react-navigation/native";
import { Color } from "../../constant/color";
import { Ionicons } from "@expo/vector-icons";
import { Icons } from "../Icons/Icons";

interface HeaderProps {
  LeftButton?: ComponentProps<typeof Ionicons>["name"] | null | React.ReactNode;
  headerName?: string;
  RightButton?: string | React.ReactNode;
  rightAction?: () => void;
  addLeftAction?: () => void;
  leftAction?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  LeftButton = "close",
  headerName,
  RightButton,
  rightAction,
  addLeftAction,
  leftAction,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.HeadrContainer}>
      <Pressable
        onPress={() => {
          if (!leftAction) {
            navigation.goBack();
          } else {
            leftAction();
          }
          if (addLeftAction) addLeftAction();
        }}
        style={{
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: 10,
          left: 20,
          width: 36,
          height: 36,
        }}
      >
        {LeftButton != null && typeof LeftButton === "string" ? (
          <Icons
            size={28}
            name={LeftButton as ComponentProps<typeof Ionicons>["name"]}
          />
        ) : (
          LeftButton
        )}
      </Pressable>
      <Text style={styles.Title}>{headerName}</Text>
      {RightButton && (
        <Pressable
          onPress={rightAction}
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 10,
            right: 20,
            height: 36,
          }}
        >
          {!!RightButton && typeof RightButton == "string" ? (
            <Text style={styles.Text}>{RightButton}</Text>
          ) : (
            RightButton
          )}
        </Pressable>
      )}
    </View>
  );
};

export { Header };

const styles = StyleSheet.create({
  Text: {
    fontFamily: "NanumSquareNeo-Bold",
    height: 24,
    color: Color["blue500"],
    fontSize: 18,
    textAlign: "right",
    textAlignVertical: "center",
  },
  Title: {
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey800"],
    fontSize: 20,
  },
  HeadrContainer: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 24,
  },
});
