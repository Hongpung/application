import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { type Member } from "@hongpung/src/entities/member";
import PickMemberCard from "@hongpung/src/features/member/inviteReservation/ui/PickMemberCard";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import PickMemberCardSkeleton from "@hongpung/src/features/member/inviteReservation/ui/PickMemberCardSkeleton";

interface InvitePossibleMemberListProps {
  invitePossibleMembers: Member[];
  selectedMembers: Member[];
  toggleMember: (member: Member) => void;
  onEndReached: () => void; // 추가 리스트 요청 로직
  isLoading: boolean
}

const InvitePossibleMemberList: React.FC<InvitePossibleMemberListProps> = ({ invitePossibleMembers, isLoading, selectedMembers, toggleMember, onEndReached }) => {

  const renderItem = ({ item: member }: { item: Member }) => (
    <View style={styles.cardContainer}>
      <PickMemberCard
        member={member}
        isPicked={selectedMembers.includes(member)}
        onPress={() => { toggleMember(member) }}
      />
    </View>
  );

  return (
    <FlatList
      data={invitePossibleMembers}
      keyExtractor={(member) => member.memberId.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      onEndReached={onEndReached} // 리스트 끝에 도달했을 때 호출
      onEndReachedThreshold={0.2} // 리스트 끝에서 50% 남았을 때 호출
      ListFooterComponent={
        isLoading ? (
          <>
            <PickMemberCardSkeleton />
            <PickMemberCardSkeleton />
            <PickMemberCardSkeleton />
          </>
        ) : null
      }
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

export default InvitePossibleMemberList;