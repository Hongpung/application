import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { ManageInstrumentCard } from "@hongpung/src/entities/instrument/ui/ManageInstrumentCard/ManageInstrumentCard";
import { type Instrument } from "@hongpung/src/entities/instrument";
import { Color, Icons } from "@hongpung/src/common";
import { useInstrumentList } from "@hongpung/src/entities/instrument/model/useInstrumentList";
import { InstrumentSkeletonCard } from "@hongpung/src/entities/instrument/ui/InstrumentSkeletonCard/InstrumentSkeletonCard";

interface InstrumentViewListProps {
  instrumentList: Instrument[];
  onInstrumentClick: (instrument: Instrument) => void;
  isLoading: boolean;
}

const InstrumentViewList: React.FC<InstrumentViewListProps> = ({
  instrumentList,
  onInstrumentClick,
  isLoading,
}) => {
  const { isOpen, toggleAccordion, orderInstruments } = useInstrumentList({
    instrumentList,
  });

  const data = Object.entries(orderInstruments).map(([type, instruments]) => ({
    type,
    instruments,
  }));

  const renderItem = ({ item }: { item: (typeof data)[0] }) => {
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
            <ManageInstrumentCard
              key={`${instrument.name}-${index}`}
              instrument={instrument}
              onClickInstrument={onInstrumentClick}
            />
          ))}
        </View>
      </View>
    );
  };

  if (isLoading)
    return (
      <View
        style={[
          styles.instrumentContainer,
          { marginHorizontal: 24, paddingTop: 36 },
        ]}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <InstrumentSkeletonCard key={index + "skeleton"} />
        ))}
      </View>
    );
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

export default InstrumentViewList;
