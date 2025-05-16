import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

import SelectedParticipatorList from "@hongpung/src/widgets/reservation/ui/SelectedParticipatorHList/SelectedParticipatorHList";
import { Header } from "@hongpung/src/common";
import { Icons } from "@hongpung/src/common/ui/Icons/Icons";
import { ParticipatorsConfirmButton } from "@hongpung/src/widgets/reservation/ui/ParticipatorsConfirmButton/ParticipatorsConfirmButton";
import OptionsModal from "@hongpung/src/widgets/reservation/ui/OptionsModal/OptionsModal";
import FilterHList from "@hongpung/src/widgets/reservation/ui/FilterHList/FilterHList";
import SearchMemberNameBar from "@hongpung/src/widgets/reservation/ui/SearchMemberNameBar.tsx/SearchMemberNameBar";
import { useParticipatorsFilters } from "@hongpung/src/features/reservation/configureReservation/model/useParticipatorsFilters";
import { useSelectParticipators } from "@hongpung/src/features/reservation/configureReservation/model/useSelectParticipators";
import { Color } from "@hongpung/src/common";

import { useInvitePossibleMemberData } from "@hongpung/src/features/reservation/configureReservation/model/useParaticipatorData";
import { useEditReservation } from "@hongpung/src/features/reservation/editReservation/model/useEditReservation.context";
import InvitePossibleMemberList from "@hongpung/src/widgets/reservation/ui/InvitePossibleMemberList/InvitePossibleMemberList";
import { EditReservationStackScreenProps } from "@hongpung/src/common/navigation";

const ParticipantsSelectScreen: React.FC<EditReservationStackScreenProps<"EditReservationParticipatorsSelect">> = ({ navigation }) => {
  const {
    findOptions,
    setFindOptions,
    descendingOrder,
    setDescendingOrder,
    selectedClubs,
    setClubsOption,
    selectedEnrollmentNumberRange,
    setEnrollmentNumberRange,
    debounceKeyword,
    handleApplyFilters,
    handleResetFilters,
    filterParams,
  } = useParticipatorsFilters();

  const { reservation, setParticipators } = useEditReservation();

  const { data, isLoading, loadNewPage } =
    useInvitePossibleMemberData(filterParams);

  const { ...participatorsData } = useSelectParticipators(
    reservation.participators
  );

  const { newParticipators, toggleParticipator } = participatorsData;

  const [optionsSelectState, setOptionSelectState] = useState(false);

  const [searchBarVisible, setSearchBarVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Header
        leftButton="close"
        headerName={"인원 선택"}
        RightButton={
          <Icons size={28} name={"search"} color={Color["grey400"]} />
        }
        rightAction={() => setSearchBarVisible(true)}
      />
      <View style={{ flex: 1 }}>
        <OptionsModal
          visible={optionsSelectState}
          selectedClubs={selectedClubs}
          setClubsOption={setClubsOption}
          selectedEnrollmentNumberRange={selectedEnrollmentNumberRange}
          setEnrollmentNumberRange={setEnrollmentNumberRange}
          onClose={handleResetFilters}
          onApply={handleApplyFilters}
        />

        <SearchMemberNameBar
          searchBarVisible={searchBarVisible}
          setSearchBarVisible={setSearchBarVisible}
          setFindOptions={setFindOptions}
          debounceKeyword={debounceKeyword}
        />
        <View>
          <FilterHList
            descendingOrder={descendingOrder}
            setDescendingOrder={setDescendingOrder}
            findOptions={findOptions}
            setOptionSelectState={setOptionSelectState}
          />
        </View>

        {!data || data?.length === 0 ? (
          <View style={styles.noParticipantsContainer}>
            <Text style={styles.noParticipantsText}>
              함께 할 수 있는 인원이 없습니다.
            </Text>
          </View>
        ) : (
          <View style={styles.participantsListContainer}>
            <InvitePossibleMemberList
              invitePossibleMembers={data}
              selectedMembers={newParticipators}
              toggleMember={toggleParticipator}
              onEndReached={loadNewPage}
              isLoading={isLoading}
            />
          </View>
        )}

        {newParticipators.length > 0 && (
          <View style={styles.selectedParticipantsContainer}>
            <SelectedParticipatorList {...participatorsData} />

            <ParticipatorsConfirmButton
              participatorsLength={newParticipators.length}
              onPress={() => {
                setParticipators([...newParticipators]);
                navigation.navigate("EditReservationForm")
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default ParticipantsSelectScreen;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  searchBarContainer: {
    backgroundColor: Color["grey100"],
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    paddingHorizontal: 12,
    fontSize: 16,
    height: 32,
    flex: 1,
  },
  searchCloseButton: {
    height: 36,
    width: 36,
    justifyContent: "center",
    alignItems: "center",
  },
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
    justifyContent: "center",
  },
  noParticipantsContainer: {
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  noParticipantsText: {
    marginHorizontal: "auto",
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 18,
    color: Color["grey400"],
  },
  participantsListContainer: {
    flex: 1,
    marginTop: 12,
    position: "relative",
  },
  selectedParticipantsContainer: {
    paddingTop: 12,
    width: "100%",
  },
});
