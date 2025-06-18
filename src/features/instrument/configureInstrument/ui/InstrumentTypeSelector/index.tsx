import { Color, Selector } from "@hongpung/src/common";
import { instrumentTypes } from "@hongpung/src/entities/instrument/constant/instrumentTypes";
import { View, Text, StyleSheet, Pressable } from "react-native";

type InstrumentTypeSelectorProps = {
  setSelectTypeVisible: React.Dispatch<boolean>;
  onSelectType: boolean;

  instrumentType: InstrumentType | null;
  setInstrumentType: React.Dispatch<InstrumentType>;
};

export const InstrumentTypeSelector: React.FC<InstrumentTypeSelectorProps> = (
  props,
) => {
  const {
    setSelectTypeVisible,
    onSelectType,
    setInstrumentType,
    instrumentType,
  } = props;

  return (
    <View style={[styles.Row]}>
      <Text style={styles.RowLeft}>{`악기 타입`}</Text>

      <Selector
        label="악기 종류"
        setVisible={setSelectTypeVisible}
        onChange={(value) => setInstrumentType(value as InstrumentType)}
        options={instrumentTypes}
        trigger={Pressable}
        visible={onSelectType}
        value={instrumentType}
        color="blue"
        align="right"
      >
        <Text
          style={[
            styles.RowRight,
            {
              width: 120,
              color:
                instrumentType === null ? Color["grey800"] : Color["grey 400"],
            },
          ]}
        >
          {instrumentType || "악기"}
        </Text>
      </Selector>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 154,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Color["grey200"],
  },
  imageContainer: {
    overflow: "hidden",
    width: 308,
    height: 204,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 308,
    height: 204,
  },
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
