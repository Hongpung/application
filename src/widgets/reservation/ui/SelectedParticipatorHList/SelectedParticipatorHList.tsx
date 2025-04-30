import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Member } from "@hongpung/src/entities/member";
import { Color, Icons } from "@hongpung/src/common";

interface SelectedParticipatorListProps {
  newParticipators: Member[];
  setNewParticipators: React.Dispatch<React.SetStateAction<Member[]>>;
}

const SelectedParticipatorList: React.FC<SelectedParticipatorListProps> = ({
  newParticipators,
  setNewParticipators,
}) => {
  return (
    <>
      <View style={{ paddingHorizontal: 28 }}>
        <Text
          style={{
            paddingHorizontal: 4,
            fontFamily: "NanumSquareNeo-Regular",
          }}
        >
          선택한 인원
        </Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 28, paddingVertical: 12, gap: 4 }}
        data={newParticipators}
        keyExtractor={(_, index) => "selected-member-" + index}
        renderItem={({ item: participator }) => (
          <View style={styles.participantContainer}>
            <Text style={[styles.participantText, { color: Color["grey500"] }]}>
              {participator.name}
              {participator.nickname ? `(${participator.nickname})` : ""}
            </Text>

            <Pressable
              onPress={() => {
                setNewParticipators(
                  newParticipators.filter(
                    (participatorData) =>
                      participatorData.memberId != participator.memberId
                  )
                );
              }}
            >
              <Icons name="close-circle" size={24} color={Color["grey400"]} />
            </Pressable>
          </View>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  participantContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Color["grey200"],
    justifyContent: "center",
    zIndex: 0,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  participantText: {
    fontFamily: "NanumSquareNeo-Regular",
  },
});

export default SelectedParticipatorList;
