import React from "react";
import { View, StyleSheet } from "react-native";
import { LongButton } from "@hongpung/src/common";

interface CheckInButtonProps {
  isCheckin: boolean;
  sessionStatus: string;
  onPress: () => void;
}

export const CheckInButton: React.FC<CheckInButtonProps> = ({
  isCheckin,
  sessionStatus,
  onPress,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <LongButton
        color="blue"
        innerContent={
          isCheckin
            ? "확인"
            : sessionStatus === "JOINABLE"
            ? "맞아요"
            : "시작할래요"
        }
        onPress={onPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 16,
    width: "100%",
    paddingHorizontal: 16,
    alignSelf: "center",
  },
});
