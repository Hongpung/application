import React, { useCallback, useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { type Member } from "@hongpung/src/entities/member";
import MemberCard from "@hongpung/src/entities/member/ui/MemberCard/MemberCard";
import MemberCardSkeleton from "@hongpung/src/entities/member/ui/MemberCardSkeleton/MemberCardSkeleton";
import { MemberDetailModal } from "@hongpung/src/entities/member/ui/MemberDetailModal/MemberDetailModal";
import { Color } from "@hongpung/src/common";

interface MemberListProps {
  members?: Member[];
  isLoading?: boolean;
  EmptyComponent?: React.ReactNode;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  isLoading = false,
  EmptyComponent,
}) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const renderItem = useCallback(
    ({ item: member }: { item: Member }) => (
      <View style={styles.cardContainer}>
        <MemberCard
          member={member}
          onPress={() => {
            setSelectedMember(member);
          }}
        />
      </View>
    ),
    [],
  );
  if (isLoading)
    return (
      <FlatList
        data={Array.from({ length: 6 })}
        keyExtractor={(_, i) => i.toString()}
        renderItem={() => <MemberCardSkeleton />}
        initialNumToRender={4}
        windowSize={5}
      />
    );
  return (
    <>
      {selectedMember && (
        <MemberDetailModal
          selectedMember={selectedMember}
          resetMember={() => setSelectedMember(null)}
        />
      )}
      <FlatList
        style={{ flex: 1 }}
        data={members}
        keyExtractor={(member, index) =>
          member.memberId
            ? member.memberId.toString()
            : index.toString() + "member"
        }
        renderItem={renderItem}
        ListEmptyComponent={
          !!EmptyComponent ? (
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

export default MemberList;
