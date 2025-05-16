import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import {
  BorrowInstrumentCard,
  type Instrument,
} from "@hongpung/src/entities/instrument";
import { Color, Icons } from "@hongpung/src/common";
import { useInstrumentAccordionList } from "@hongpung/src/entities/instrument/model/useInstrumentAccordionList";

interface BorrowInstrumentListProps {
  instrumentList: Instrument[];
  navigateToInstrumentDetail: (instrument: Instrument) => void;
}

const BorrowInstrumentList: React.FC<BorrowInstrumentListProps> = ({
  instrumentList,
  navigateToInstrumentDetail
}) => {
  const { isOpen, toggleAccordion, orderedInstrumentData } =
    useInstrumentAccordionList({ instrumentList });

  const data = orderedInstrumentData;

  const renderItem = ({ item }: { item: typeof data[0] }) => {
    if (item.instruments.length === 0) return null;

    return (
      <View>
        <Pressable
          onPress={() => toggleAccordion(item.type)}
          style={styles.ArccodianMenu}
        >
          <Text style={styles.ArccodianMenuText}>{item.type}</Text>

          <Icons
            name={isOpen(item.type) ? "chevron-up" : "chevron-down"}
            color={Color["grey800"]}
            size={24}
          />
        </Pressable>
        <View style={styles.instrumentContainer}>
          {item.instruments.map((instrument, index) => (
            <BorrowInstrumentCard
              key={`${instrument.name}-${index}`}
              instrument={instrument}
              onClickInstrument={navigateToInstrumentDetail}
              isPicked={false}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.type}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 24,
  },
  typeHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  typeText: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 18,
    color: Color["grey500"],
  },
  instrumentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    rowGap: 16,
    paddingVertical: 12,
  },
  ArccodianMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  ArccodianMenuText: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 18,
    color: Color["grey800"],
  },
});

export default BorrowInstrumentList;
