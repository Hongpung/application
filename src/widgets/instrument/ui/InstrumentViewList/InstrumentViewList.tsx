import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { ManageInstrumentCard } from "@hongpung/src/entities/instrument/ui/ManageInstrumentCard/ManageInstrumentCard";
import { type Instrument } from "@hongpung/src/entities/instrument";
import { Color, Icons } from "@hongpung/src/common";
import { useInstrumentAccordionList } from "@hongpung/src/entities/instrument";
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
  const { isOpen, toggleAccordion, orderedInstrumentData } = useInstrumentAccordionList({
    instrumentList,
  });

  const renderItem = ({
    item,
  }: {
    item: { type: InstrumentType; instruments: Instrument[] };
  }) => {
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
        <View style={styles.instrumentSkeletonContainer}>
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
      <FlatList
        data={Array.from({ length: 6 })}
        keyExtractor={(item, index) => index + "skeleton"}
        style={[
          styles.container,
          { marginHorizontal: 24, paddingVertical: 12 },
        ]}
        contentContainerStyle={styles.instrumentSkeletonContainer}
        initialNumToRender={4}
        windowSize={5}
        renderItem={() => <InstrumentSkeletonCard />}
      />
    );

  // Object 배열이라 empty 체크가 별도로 필요함

  return (
    <FlatList
      data={orderedInstrumentData}
      renderItem={renderItem}
      keyExtractor={(item) => item.type}
      style={styles.container}
      contentContainerStyle={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Regular",
              fontSize: 18,
              color: Color["grey400"],
              paddingBottom: 60
            }}
          >
            사용할 수 있는 악기가 없어요
          </Text>
        </View>
      }
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
  instrumentSkeletonContainer: {
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
