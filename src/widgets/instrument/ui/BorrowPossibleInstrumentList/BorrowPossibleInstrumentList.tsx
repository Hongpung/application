import { Color, Icons } from "@hongpung/src/common";
import {
  BorrowInstrumentCard,
  Instrument,
} from "@hongpung/src/entities/instrument";
import { Pressable, FlatList, View, Text, StyleSheet } from "react-native";
import { useInstrumentList } from "../../../../entities/instrument/model/useInstrumentList";

type BorrowPossibleInstrumentListProps = {
  instrumentList: Instrument[];
  selectedInstruments: Instrument[];
  toggleInstrument: (instrument: Instrument) => void;
  isLoading: boolean;
};

const BorrowPossibleInstrumentList: React.FC<
  BorrowPossibleInstrumentListProps
> = ({ instrumentList, selectedInstruments, toggleInstrument, isLoading }) => {
  const { isOpen, toggleAccordion, orderInstruments } =
    useInstrumentList({ instrumentList });

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const data = Object.entries(orderInstruments).map(([type, instruments]) => ({
    type,
    instruments,
    selectedCount: instruments.filter((instrument) =>
      selectedInstruments.includes(instrument)
    ).length,
  }));

  const renderItem = ({ item }: { item: (typeof data)[0] }) => {
    if (item.instruments.length === 0) return null;

    const hasSelected = item.selectedCount > 0;

    return (
      <View>
        <Pressable
          onPress={() => toggleAccordion(item.type)}
          style={styles.container}
        >
          <Text
            style={[
              styles.typeText,
              hasSelected ? styles.typeTextSelected : styles.typeTextUnselected,
            ]}
          >
            {item.type}
            {item.selectedCount > 0 && ` (${item.selectedCount})`}
          </Text>

          <Icons
            name={isOpen(item.type) ? "chevron-up" : "chevron-down"}
            color={Color["grey800"]}
            size={24}
          />
        </Pressable>

        {isOpen(item.type) && (
          <View style={styles.instrumentsContainer}>
            {item.instruments.map((instrument, index) => (
              <BorrowInstrumentCard
                key={index}
                instrument={instrument}
                isPicked={selectedInstruments.includes(instrument)}
                onClickInstrument={toggleInstrument}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.type}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  typeText: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 18,
  },
  typeTextSelected: {
    color: Color["blue500"],
  },
  typeTextUnselected: {
    color: Color["grey800"],
  },
  instrumentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    rowGap: 16,
    paddingVertical: 12,
  },
});

export default BorrowPossibleInstrumentList;
