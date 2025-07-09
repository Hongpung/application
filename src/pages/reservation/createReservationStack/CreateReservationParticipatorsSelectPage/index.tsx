import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { Header, Color, Icons } from "@hongpung/src/common";
import { ParticipatorsConfirmButton } from "@hongpung/src/widgets/reservation/ui/ParticipatorsConfirmButton/ParticipatorsConfirmButton";

import SelectedParticipatorList from "@hongpung/src/widgets/reservation/ui/SelectedParticipatorHList/SelectedParticipatorHList";
import OptionsModal from "@hongpung/src/widgets/reservation/ui/OptionsModal/OptionsModal";
import FilterHList from "@hongpung/src/widgets/reservation/ui/FilterHList/FilterHList";
import SearchMemberNameBar from "@hongpung/src/widgets/reservation/ui/SearchMemberNameBar.tsx/SearchMemberNameBar";

import { useCreateReservation } from "@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context";
import InvitePossibleMemberList from "@hongpung/src/widgets/reservation/ui/InvitePossibleMemberList/InvitePossibleMemberList";
import { useParticipatorsFilters } from "@hongpung/src/features/reservation/configureReservation/model/useParticipatorsFilters";
import { useInvitePossibleMemberData } from "@hongpung/src/features/reservation/configureReservation/model/useParaticipatorData";
import { useSelectParticipators } from "@hongpung/src/features/reservation/configureReservation/model/useSelectParticipators";
import { CreateReservationStackScreenProps } from "@hongpung/src/common/navigation";

const CreateReservationParticipatorsSelectScreen: React.FC<
  CreateReservationStackScreenProps<"CreateReservationParticipatorsSelect">
> = ({ navigation }) => {
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

  const { reservation, setParticipators } = useCreateReservation();

  const { data, isLoading, loadNewPage } =
    useInvitePossibleMemberData(filterParams);

  const { toggleParticipator, ...participatorsData } = useSelectParticipators(
    reservation.participators,
  );

  const { newParticipators } = participatorsData;

  const [optionsSelectState, setOptionSelectState] = useState(false);

  const [searchBarVisible, setSearchBarVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Header
        LeftButton="close"
        headerName={"인원 선택"}
        RightButton={
          <Icons size={28} name={"search"} color={Color["grey400"]} />
        }
        rightAction={() => setSearchBarVisible(true)}
      />
      <OptionsModal
        visible={optionsSelectState}
        selectedClubs={selectedClubs}
        setClubsOption={setClubsOption}
        selectedEnrollmentNumberRange={selectedEnrollmentNumberRange}
        setEnrollmentNumberRange={setEnrollmentNumberRange}
        onClose={() => {
          handleResetFilters();
          setOptionSelectState(false);
        }}
        onApply={() => {
          handleApplyFilters();
          setOptionSelectState(false);
        }}
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

      <View style={styles.participantsListContainer}>
        <InvitePossibleMemberList
          invitePossibleMembers={data}
          onEndReached={loadNewPage}
          isLoading={isLoading}
          selectedMembers={newParticipators}
          toggleMember={toggleParticipator}
        />
      </View>

      {newParticipators.length > 0 && (
        <View style={styles.selectedParticipantsContainer}>
          <SelectedParticipatorList {...participatorsData} />

          <ParticipatorsConfirmButton
            participatorsLength={newParticipators.length}
            onPress={() => {
              setParticipators([...newParticipators]);
              navigation.navigate("CreateReservationForm");
            }}
          />
        </View>
      )}
    </View>
  );
};

export default CreateReservationParticipatorsSelectScreen;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
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
