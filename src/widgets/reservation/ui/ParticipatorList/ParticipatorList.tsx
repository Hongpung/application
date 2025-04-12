import React from "react";
import { View, StyleSheet, ScrollView, FlatList } from "react-native";
import { type Member } from "@hongpung/src/entities/member";
import MemberCard from "@hongpung/src/features/member/viewMemberList/ui/MemberCard";

interface ParticipatorListProps {
  participators: Member[];
}

const ParticipatorList: React.FC<ParticipatorListProps> = ({ participators }) => {

  const renderItem = ({ item: member }: { item: Member }) => (
    <View style={styles.cardContainer}>
      <MemberCard
        member={member}
        onPress={() => { }}
      />
    </View>
  );

  return (
    <FlatList
      data={participators}
      contentContainerStyle={styles.listContainer}
      keyExtractor={(member) => member.memberId.toString()}
      renderItem={renderItem}
    />
  );
};


const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  cardContainer: {
    marginVertical: 8,
    marginHorizontal: 24,
  },
  modalOverlay: {
    height: "100%",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    height: 256,
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 16,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ParticipatorList;