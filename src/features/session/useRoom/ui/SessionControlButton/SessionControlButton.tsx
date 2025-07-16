import { Color, LongButton } from "@hongpung/src/common";
import { View, Text, StyleSheet } from "react-native";

interface SessionControlButtonProps {
  canExtand: boolean;
  canReturn: boolean;
  handleExtendSession: () => void;
  handleReturnSession: () => void;
}

export const SessionControlButton: React.FC<SessionControlButtonProps> = (
  props,
) => {
  const { canExtand, canReturn, handleExtendSession, handleReturnSession } =
    props;

  return (
    <View style={styles.buttonContainer}>
      {!canExtand && (
        <Text style={styles.errorText}>
          연장은 종료 15분 이전까지만 가능해요
        </Text>
      )}
      {!canReturn && (
        <Text style={styles.errorText}>종료는 15분 이상 이용 후 가능해요</Text>
      )}
      <LongButton
        color="green"
        innerContent="30분 연장하기"
        isAble={canExtand}
        onPress={handleExtendSession}
      />
      <LongButton
        color="red"
        innerContent="종료하기"
        isAble={canReturn}
        onPress={handleReturnSession}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    bottom: 0,
    display: "flex",
    gap: 12,
    paddingBottom: 28,
  },
  errorText: {
    alignSelf: "center",
    color: Color["red700"],
    fontSize: 14,
    fontFamily: "NanumSquareNeo-Bold",
  },
});
