import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { type Member } from "@hongpung/src/entities/member";
import ParticipatorCard from "@hongpung/src/entities/member/ui/ParticipatorCard/ParticipatorCard";
import MemberCardSkeleton from "@hongpung/src/entities/member/ui/MemberCardSkeleton/MemberCardSkeleton";

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
      <ParticipatorCard
        member={member}
        isPicked={selectedMembers.some(selectedMember => selectedMember.memberId === member.memberId)}
        onPress={() => { toggleMember(member) }}
      />
    </View>
  );

  return (
    <FlatList
      data={invitePossibleMembers}
      keyExtractor={(member, index) => member.memberId.toString() + "member" + index}
      renderItem={renderItem}
      style={{ flex: 1 }}
      contentContainerStyle={styles.listContainer}
      onEndReached={onEndReached} // 리스트 끝에 도달했을 때 호출
      onEndReachedThreshold={0.2} // 리스트 끝에서 50% 남았을 때 호출
      ListFooterComponent={
        isLoading ? (
          <>
            <MemberCardSkeleton key={"skeleton1"} />
            <MemberCardSkeleton key={"skeleton2"} />
            <MemberCardSkeleton key={"skeleton3"} />
            <MemberCardSkeleton key={"skeleton4"} />
            <MemberCardSkeleton key={"skeleton5"} />
          </>

        ) : null
      }
    />
  );

};


const styles = StyleSheet.create({
  listContainer: {
    // flex: 1,
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