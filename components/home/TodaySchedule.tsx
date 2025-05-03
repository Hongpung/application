import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Color } from "@hongpung/src/common";
import { useAtomValue } from "jotai";

import {
  myTodayReservationState,
  ReservationCard,
} from "@hongpung/src/entities/reservation";

interface TodayScheduleProps {
  navigateToReservationDetail: (reservationId: number) => void;
  navigateToReservationCalendar: () => void;
}

const TodaySchedule: React.FC<TodayScheduleProps> = ({
  navigateToReservationDetail,
  navigateToReservationCalendar,
}) => {
  const todayReservationsData = useAtomValue(myTodayReservationState);

  return (
    <View
      style={[
        styles.ScheduleContainer,
        todayReservationsData && todayReservationsData?.length > 0
          ? {
              borderColor: Color["blue500"],
              backgroundColor: Color["blue500"],
            }
          : {
              borderWidth: 4,
              borderColor: Color["grey300"],
              borderStyle: "dashed",
            },
      ]}
    >
      {todayReservationsData && todayReservationsData?.length > 0 ? (
        <View style={{ display: "flex", gap: 4 }}>
          {todayReservationsData?.map((reservation) => {
            return (
              <ReservationCard
                key={reservation.reservationId}
                onPress={() => {
                  navigateToReservationDetail(reservation.reservationId);
                }}
                reservation={reservation}
              />
            );
          })}
          {/* <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14 }}>오늘의 일정이 있어요</Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: '#FFF', fontSize: 18 }}>예약 확인하러 가기</Text> */}
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.95}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flex: 1,
            justifyContent: "center",
          }}
          onPress={() => {
            navigateToReservationCalendar();
          }}
        >
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Bold",
              color: Color["grey500"],
              fontSize: 18,
            }}
          >
            오늘의 일정이 없어요
          </Text>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-ExtraBold",
              color: Color["grey300"],
              fontSize: 14,
            }}
          >
            새로운 일정 예약하러 가기
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TodaySchedule;

const styles = StyleSheet.create({
  ScheduleContainer: {
    height: 156,
    borderRadius: 10,
  },
  textRow: {
    flexDirection: "column",
    gap: 8,
    alignItems: "flex-start",
    paddingHorizontal: 4,
  },
  greetingText: {
    position: "relative",
    textAlign: "right",
    color: Color["grey800"],
    fontSize: 18,
    fontFamily: "NanumSquareNeo-Bold",
  },
  dateText: {
    position: "relative",
    color: Color["grey800"],
    fontSize: 14,
    fontFamily: "NanumSquareNeo-Regular",
    lineHeight: 16,
  },
});
