import { isEmpty } from "@hongpung/src/entities/session/lib/isEmptySession";
import { ScheduleCard } from "@hongpung/src/entities/session/model/type";
import EmptySessionCard from "@hongpung/src/entities/session/ui/EmptySessionCard/EmptySessionCard";
import NoScheduleCard from "@hongpung/src/entities/session/ui/NoScheduleCard/NoScheduleCard";
import SessionCard from "@hongpung/src/entities/session/ui/SessionCard/SessionCard";
import React, { forwardRef } from "react";
import { View, FlatList, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

type ScheduleCardListProps = {
  isOnAir: 'PREPARING' | 'ON_AIR' | 'CLOSED' | 'AVAILABLE';
  scheduleCards: ScheduleCard[];
  navigateToQRScan: () => void;
  navigateToDetail: (reservationId: number) => void;
};

export const ScheduleCardList = forwardRef<
  FlatList<ScheduleCard>,
  ScheduleCardListProps
>((props, ref) => {
  const { isOnAir, scheduleCards, navigateToDetail, navigateToQRScan } = props;

  const isNoSchedule =
    scheduleCards.length === 0 ||
    (scheduleCards?.length == 1 && scheduleCards[0].type === "empty");

  if (isNoSchedule) {
    return <NoScheduleCard toNavigateQRScan={navigateToQRScan} />;
  }

  return (
    <FlatList
      ref={ref}
      contentContainerStyle={{ position: "relative", alignItems: "center" }}
      data={scheduleCards}
      horizontal
      pagingEnabled={true}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) =>
        ((item?.type === "session" &&
          item.session.sessionType === "RESERVED" &&
          item.session.title) ||
          "false") + index
      }
      snapToAlignment="start"
      snapToInterval={width - 36}
      decelerationRate="fast"
      onScrollToIndexFailed={(info) => {
        // ref 타입 체크 후 접근
        if (ref !== null && "current" in ref) {
          setTimeout(() => {
            if (ref.current) {
              ref.current.scrollToIndex({
                index: info.index,
                animated: false,
              });
            }
          }, 100);
        }
      }}
      renderItem={({ item }: { item: ScheduleCard }) => {
        if (isEmpty(item)) {
          if (isOnAir === 'ON_AIR') return null;
          return (
            <EmptySessionCard nextReservationTime={item.nextReservationTime} />
          );
        }
        return (
          <SessionCard
            session={item.session}
            navigateToDetail={navigateToDetail}
          />
        );
      }}
      ListHeaderComponent={() => {
        return <View style={{ width: 24 }} />;
      }}
      ItemSeparatorComponent={() => {
        return <View style={{ width: 12 }} />;
      }}
      ListFooterComponent={() => {
        return <View style={{ width: 24 }} />;
      }}
    />
  );
});

export default ScheduleCardList;
