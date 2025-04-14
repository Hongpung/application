import React from "react";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { Icons } from "@hongpung/src/common/ui/Icons/Icons";
import { Color } from "@src/common";

interface FilterHListProps {
  descendingOrder: boolean;
  setDescendingOrder: (value: boolean) => void;
  findOptions: {
    club: string[];
    enrollmentNumberRange: { startNumber?: string; endNumber?: string };
  };
  setOptionSelectState: (value: boolean) => void;
}

const FilterHList: React.FC<FilterHListProps> = ({
  descendingOrder,
  setDescendingOrder,
  findOptions,
  setOptionSelectState,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterBarContainer}
    >
      <Pressable
        style={[
          styles.filterBox,
          { flexDirection: "row", alignItems: "center", gap: 2 },
        ]}
        onPress={() => setDescendingOrder(!descendingOrder)}
      >
        <Text style={styles.filterText}>학번순</Text>
        <Icons
          size={20}
          name={descendingOrder ? "arrow-down" : "arrow-up"}
          color={Color["blue400"]}
        />
      </Pressable>
      {findOptions.club.length > 0 && (
        <View
          style={[
            styles.filterBox,
            {
              borderColor: Color["blue500"],
              backgroundColor: Color["blue100"],
            },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              { fontFamily: "NanumSquareNeo-Bold", color: Color["blue500"] },
            ]}
          >
            동아리:{findOptions.club.join(", ")}
          </Text>
        </View>
      )}
      {findOptions.enrollmentNumberRange.startNumber && (
        <View
          style={[
            styles.filterBox,
            {
              borderColor: Color["blue500"],
              backgroundColor: Color["blue100"],
            },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              { fontFamily: "NanumSquareNeo-Bold", color: Color["blue500"] },
            ]}
          >
            최소 학번:{findOptions.enrollmentNumberRange.startNumber}
          </Text>
        </View>
      )}
      {findOptions.enrollmentNumberRange.endNumber && (
        <View
          style={[
            styles.filterBox,
            {
              borderColor: Color["blue500"],
              backgroundColor: Color["blue100"],
            },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              { fontFamily: "NanumSquareNeo-Bold", color: Color["blue500"] },
            ]}
          >
            최대 학번:{findOptions.enrollmentNumberRange.endNumber}
          </Text>
        </View>
      )}

      <Pressable
        style={[
          styles.filterButton,
          { flexDirection: "row", alignItems: "center", gap: 4 },
        ]}
        onPress={() => setOptionSelectState(true)}
      >
        <Text style={{ color: Color["grey400"] }}>필터 변경</Text>
        <Icons size={20} name={"funnel"} color={Color["grey300"]} />
      </Pressable>
    </ScrollView>
  );
};

export default FilterHList;

const styles = StyleSheet.create({
  filterBarContainer: {
    height: 32,
    marginTop: 8,
    marginHorizontal: 24,
    gap: 8,
    alignItems: "flex-start",
    paddingHorizontal: 4,
  },
  filterBox: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Color["grey200"],
    justifyContent: "center",
    zIndex: 0,
    backgroundColor: "#FFF",
  },
  filterText: {
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
  },
  filterButton: {
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: Color["grey100"],
    height: 32,
    fontFamily: "NanumSquareNeo-Regular",
    gap: 4,
    justifyContent: "center",
  },
});
