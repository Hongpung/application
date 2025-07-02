import { Icons } from "@hongpung/src/common";
import { Pressable, StyleSheet } from "react-native";

interface HeaderProps {
  isSlideUp: boolean;
  toggleBottomSheet: () => void;
}

export const Header = ({ isSlideUp, toggleBottomSheet }: HeaderProps) => {
  return (
    <Pressable style={styles.toggleButton} onPress={toggleBottomSheet}>
      <Icons
        name={isSlideUp ? "chevron-down" : "chevron-up"}
        color={"#FFF"}
        size={24}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    display: "flex",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "center",
  },
});
