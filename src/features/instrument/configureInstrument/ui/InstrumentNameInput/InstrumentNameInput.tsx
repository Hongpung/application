import { Color } from "@hongpung/src/common";
import { View, Text, TextInput, StyleSheet } from "react-native";

type InstrumentNameInputProps = {
  value: string;
  setValue: (text: string) => void;
};

export const InstrumentNameInput: React.FC<InstrumentNameInputProps> = (
  props,
) => {
  const { value, setValue } = props;

  return (
    <View style={styles.Row}>
      <Text style={styles.RowLeft}>{`악기 이름`}</Text>

      <TextInput
        value={value}
        onChangeText={setValue}
        style={[styles.RowRight, { borderBottomWidth: 0.5, paddingBottom: 4 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Row: {
    flexDirection: "row",
    height: 40,
    width: 342,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  RowLeft: {
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 16,
    color: Color["grey400"],
  },
  RowRight: {
    width: 80,
    textAlign: "right",
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 16,
    color: Color["grey700"],
  },
});
