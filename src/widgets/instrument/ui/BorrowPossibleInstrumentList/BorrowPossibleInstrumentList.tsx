import { Color, Icons } from "@hongpung/src/common";
import {
  BorrowInstrumentCard,
  Instrument,
  useInstrumentAccordionList,
} from "@hongpung/src/entities/instrument";
import { Pressable, FlatList, View, Text, StyleSheet } from "react-native";

type BorrowPossibleInstrumentListProps = {
  instrumentList: Instrument[] | undefined;
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
            selectedInstruments.includes(instrument),
          ).length > 0;

        return (
          <View style={{ overflow: "hidden" }}>
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

            <FlatList
              style={[
                styles.instrumentsContainer,
                isOpen(item.type) ? {} : { height: 0, paddingVertical: 0 },
              ]}
              numColumns={2}
              columnWrapperStyle={{ gap: 16 }}
              data={item.instruments}
              renderItem={({ item, index }) => (
                <BorrowInstrumentCard
                  key={index}
                  instrument={item}
                  isPicked={selectedInstruments.includes(item)}
                  onClickInstrument={toggleInstrument}
                />
              )}
            />
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
