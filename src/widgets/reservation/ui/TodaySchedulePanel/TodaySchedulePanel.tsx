import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { Color, Icons } from "@hongpung/src/common";

import {
  ReservationTicket,
  useLoadMyTodayReservationFetch,
} from "@hongpung/src/entities/reservation";

interface TodaySchedulePanelProps {
  navigateToReservationDetail: (reservationId: number) => void;
  navigateToReservationCalendar: () => void;
}

const TICKET_HEIGHT = 124;
const TICKET_GAP = 8;

export const TodaySchedulePanel: React.FC<TodaySchedulePanelProps> = ({
  navigateToReservationDetail,
  navigateToReservationCalendar,
}) => {
  const { data: todayReservationsData } = useLoadMyTodayReservationFetch();
  const [isExpanded, setIsExpanded] = useState(false);
  const height = useRef(new Animated.Value(TICKET_HEIGHT + TICKET_GAP)).current;

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  useEffect(() => {
    if (todayReservationsData) {
      Animated.timing(height, {
        toValue:
          (isExpanded
            ? TICKET_HEIGHT * (todayReservationsData?.length || 1) +
              TICKET_GAP * (todayReservationsData?.length - 1 || 0)
            : TICKET_HEIGHT) + TICKET_GAP,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
      }).start();
    }
  }, [isExpanded, todayReservationsData, height]);

  return (
    <View
      style={[
        styles.ScheduleContainer,
        todayReservationsData && todayReservationsData?.length > 0
          ? null
          : {
              borderWidth: 4,
              borderColor: Color["grey300"],
              borderStyle: "dashed",
            },
      ]}
    >
      {todayReservationsData && todayReservationsData?.length > 0 ? (
        <>
          <Animated.View
            style={{ height: height, overflow: "hidden" }}
            onLayout={(event) => {
              console.log(event.nativeEvent.layout.height);
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                gap: TICKET_GAP,
                paddingBottom: TICKET_GAP,
              }}
            >
              {todayReservationsData.map((reservation) => {
                return (
                  <ReservationTicket
                    key={reservation.reservationId}
                    reservation={reservation}
                    onPressTicket={navigateToReservationDetail}
                  />
                );
              })}
            </View>
          </Animated.View>
          {todayReservationsData.length > 1 && (
            <Pressable
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: Color["grey100"],
                borderRadius: 8,
              }}
              onPress={handleExpand}
            >
              <Icons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={24}
                color={Color["grey500"]}
              />
            </Pressable>
          )}
        </>
      ) : (
        <TouchableOpacity
          activeOpacity={0.95}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            height: TICKET_HEIGHT,
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

const styles = StyleSheet.create({
  ScheduleContainer: {
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
