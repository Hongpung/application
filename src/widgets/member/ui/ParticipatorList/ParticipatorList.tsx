import React, { useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { type Member } from "@hongpung/src/entities/member";
import MemberCardSkeleton from "@hongpung/src/entities/member/ui/MemberCardSkeleton/MemberCardSkeleton";
import { MemberDetailModal } from "@hongpung/src/entities/member/ui/MemberDetailModal/MemberDetailModal";
import { Color } from "@hongpung/src/common";
import ParticipatorCard from "@hongpung/src/entities/member/ui/ParticipatorCard/ParticipatorCard";

interface ParticipatorListProps {
  members: Member[] | null;
  isLoading?: boolean;
  EmptyComponent?: React.ReactNode;
}

const ParticipatorList: React.FC<ParticipatorListProps> = ({
  members,
  isLoading = false,
  EmptyComponent,
}) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <>
      <MemberDetailModal
        selectedMember={selectedMember}
        resetMember={() => setSelectedMember(null)}
      />
      <FlatList
        data={members}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(member) => member.memberId.toString()}
        renderItem={({ item: member }) => (
          <ParticipatorCard
            member={member}
            onPress={() => {
              setSelectedMember(member);
            }}
            isPicked={false}
          />
        )}
        ListHeaderComponent={<View style={{ height: 12 }} />}
        ListFooterComponent={<View style={{ height: 12 }} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.skeletonContainer}>
              {Array.from({ length: 10 }).map((_, index) => (
                <MemberCardSkeleton key={index} />
              ))}
            </View>
          ) : !!EmptyComponent ? (
            <View>{EmptyComponent}</View>
          ) : (
            <Text style={styles.emptyText}>인원이 없습니다.</Text>
          )
        }
      />
    </>
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
  skeletonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Color["grey500"],
    textAlign: "center",
  },
});

export default ParticipatorList;
