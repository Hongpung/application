import { View } from "react-native";

import { Header } from "@hongpung/src/common";

import { useLoadReservationDetailFetch } from "@hongpung/src/entities/reservation";
import { ReservationStackScreenProps } from "@hongpung/src/common/navigation";

import { useDeleteReservation } from "@hongpung/src/features/reservation/deleteReservation";
import { ExternalReservationDetail } from "@hongpung/src/widgets/reservation/ui/ReservationDetail/ExternalReservationDetail";
import { InternalReservationDetail } from "@hongpung/src/widgets/reservation/ui/ReservationDetail/InternalReservationDetail";
import { ReservationDetailSkeleton } from "@hongpung/src/widgets/reservation/ui/ReservationDetail/ReservationDetailSkeleton";
import { debounce } from "lodash";

const ReservationDetailPage: React.FC<
  ReservationStackScreenProps<"ReservationDetail">
> = ({ navigation, route }) => {
  const { reservationId } = route.params;
  const {
    data: reservation,
    isLoading,
    error,
  } = useLoadReservationDetailFetch({ reservationId });
  const { onDeleteReservation } = useDeleteReservation();

  const navigateToEditReservationPage = (reservationJson: string) => {
    navigation.navigate("EditReservation", {
      screen: "EditReservationForm",
      reservationJson,
    });
  };

  const navigateToParticipatorList = (params: { participators: string }) => {
    navigation.navigate("ParticipatorList", {
      participators: params.participators,
    });
  };

  const navigateToBorrowInstrumentList = (params: {
    borrowInstruments: string;
  }) => {
    navigation.navigate("BorrowInstrumentList", {
      borrowInstruments: params.borrowInstruments,
    });
  };

  const debouncedGoBack = debounce(
    () => {
      navigation.goBack();
    },
    500,
    {
      leading: true,
      trailing: false,
    },
  );

  if (isLoading) {
    return (
      <View>
        <Header LeftButton={"close"} headerName="예약 상세 정보" />
        <ReservationDetailSkeleton />
      </View>
    );
  }
  if (!reservation || error) {
    debouncedGoBack();

    return <View></View>;
  }
  const { reservationType } = reservation;
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Header LeftButton={"close"} headerName="예약 상세 정보" />
      {reservationType === "EXTERNAL" ? (
        <ExternalReservationDetail reservation={reservation} />
      ) : (
        <InternalReservationDetail
          reservation={reservation}
          navigateToParticipatorList={navigateToParticipatorList}
          navigateToBorrowInstrumentList={navigateToBorrowInstrumentList}
          onDeleteReservation={onDeleteReservation}
          navigateToEditReservationPage={navigateToEditReservationPage}
        />
      )}
    </View>
  );
};

export default ReservationDetailPage;
