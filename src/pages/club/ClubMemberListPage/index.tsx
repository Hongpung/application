import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  useLoadMyClubMembersFetch,
  type Member,
} from "@hongpung/src/entities/member";
import Header from "@hongpung/src/common/ui/Header/Header";
import MemberList from "@hongpung/src/widgets/member/ui/MemberList/MemberList";

const ClubMemberListPage: React.FC<ClubStackProps<"ClubMembers">> = ({
  navigation,
  route,
}) => {
  const { data: members, isLoading } = useLoadMyClubMembersFetch();

  return (
    <View style={styles.container}>
      <Header leftButton={"close"} HeaderName="동아리원 목록" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MemberList members={members} isLoading={isLoading} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
