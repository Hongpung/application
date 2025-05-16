import { Color, Icons } from "@hongpung/src/common";
import {
  BorrowInstrumentCard,
  Instrument,
} from "@hongpung/src/entities/instrument";
import { Pressable, FlatList, View, Text, StyleSheet } from "react-native";
import { useInstrumentAccordionList } from "@hongpung/src/entities/instrument";

type BorrowPossibleInstrumentListProps = {
  instrumentList: Instrument[] | null;
  selectedInstruments: Instrument[];
  toggleInstrument: (instrument: Instrument) => void;
  isLoading: boolean;
};

const BorrowPossibleInstrumentList: React.FC<
  BorrowPossibleInstrumentListProps
> = ({ instrumentList, selectedInstruments, toggleInstrument, isLoading }) => {
  const { isOpen, toggleAccordion, orderedInstrumentData } =
    useInstrumentAccordionList({
      instrumentList,
    });

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orderedInstrumentData}
      keyExtractor={(item) => item.type}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <Text style={styles.emptyText}>대여 할 수 있는 악기가 없습니다.</Text>
      }
      renderItem={({ item }) => {
        if (item.instruments.length === 0) return null;

        const hasSelected =
          item.instruments.filter((instrument) =>
            selectedInstruments.includes(instrument)
          ).length > 0;

        return (
          <View>
            <Pressable
              onPress={() => toggleAccordion(item.type)}
              style={styles.container}
            >
              <Text
                style={[
                  styles.typeText,
                  hasSelected
                    ? styles.typeTextSelected
                    : styles.typeTextUnselected,
                ]}
              >
                {item.type}
                {hasSelected && ` (${item.instruments.length})`}
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
      }}
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
  emptyText: {
    marginHorizontal: "auto",
    marginTop: "60%",
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 18,
    color: Color["grey400"],
  },
});

export default BorrowPossibleInstrumentList;
