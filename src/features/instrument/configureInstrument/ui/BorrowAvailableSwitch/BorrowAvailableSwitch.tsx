import { View, Text, StyleSheet } from "react-native";
import { Switch } from "@hongpung/src/common";

interface BorrowAvailableSwitchProps {
  value: boolean;
  setValue: (value: boolean) => void;
}

export const BorrowAvailableSwitch: React.FC<BorrowAvailableSwitchProps> = ({
  value,
  setValue,
}: BorrowAvailableSwitchProps) => {
  return (
    <View style={styles.switchContainer}>
      <Text style={styles.switchLabel}>대여 가능 여부</Text>
      <Switch value={value} onChange={setValue} />
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
});
