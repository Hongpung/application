import React from "react";
import { View, StyleSheet } from "react-native";
import { useLoadMyClubMembersFetch } from "@hongpung/src/entities/club";
import { Header } from "@hongpung/src/common";
import MemberList from "@hongpung/src/widgets/member/ui/MemberList/MemberList";
import { ClubStackProps } from "@hongpung/src/common/navigation";

const ClubMemberListPage: React.FC<ClubStackProps<"ClubMembers">> = ({
  navigation,
  route,
}) => {
  const { data: members, isLoading } = useLoadMyClubMembersFetch();
  
  return (
    <View style={styles.container}>
      <Header leftButton={"close"} headerName="동아리원 목록" />
      <MemberList members={members} isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    backgroundColor: "#fff",
  },
  listContainer: {
    flex: 1,
  },
  cardContainer: {
    marginVertical: 8,
    marginHorizontal: 24,
  },
});

export default ClubMemberListPage;
