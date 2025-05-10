import { Pressable, Text, StyleSheet } from "react-native";
import { debounce } from "lodash";

interface ExtendButtonProps {
  navigateToUsingManage: () => void;
}

export const ExtendButton = ({ navigateToUsingManage }: ExtendButtonProps) => {
  return (
    <Pressable
      style={styles.extendButton}
      onPress={debounce(navigateToUsingManage, 1000, {
        leading: true,
        trailing: false,
      })}
    >
      <Text style={styles.extendButtonText}>연장/종료</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  extendButton: {
    justifyContent: "center",
  },
  extendButtonText: {
    fontFamily: "NanumSquareNeo-Bold",
    color: "#FFF",
    fontSize: 14,
    backgroundColor: `rgba(0,0,0,0.4)`,
    padding: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
}); 