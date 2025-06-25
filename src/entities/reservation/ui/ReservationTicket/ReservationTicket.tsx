import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Color } from "@hongpung/src/common";
import { Reservation } from "@hongpung/src/entities/reservation";
import { useAtomValue } from "jotai";
import { UserStatusState } from "@hongpung/src/entities/member";

interface ReservationTicketProps {
  reservation: Reservation;
  onPressTicket: (reservationId: number) => void;
}

export const ReservationTicket: React.FC<ReservationTicketProps> = ({
  reservation,
  onPressTicket,
}) => {
  const loginUser = useAtomValue(UserStatusState);
  const isCreator = reservation.creatorId === loginUser?.memberId;

  const handleLayout = (event: LayoutChangeEvent) => {
    console.log(event.nativeEvent.layout.height);
  };

  return (
    <Pressable
      style={[styles.reservationCard]}
      onPress={() => onPressTicket(reservation.reservationId)}
      onLayout={handleLayout}
    >
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          paddingVertical: 16,
          paddingLeft: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text
            style={[
              styles.creatorText,
              { color: isCreator ? Color["blue500"] : Color["green500"] },
            ]}
          >
            {isCreator ? "내가 만든 일정" : "참가하는 일정"}
          </Text>
          <Text style={styles.timeText}>|</Text>
          <Text style={styles.timeText}>{reservation.date}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <Text
            style={styles.messageText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {reservation.title || "제목이 없습니다."}
          </Text>
          <Text
            style={[styles.timeText, { textAlign: "right", paddingRight: 4 }]}
          >
            {reservation.startTime}~{reservation.endTime}
          </Text>
        </View>
      </View>

      <View
        style={{
          width: 56,
          backgroundColor: isCreator ? Color["blue200"] : Color["green200"],
          flexShrink: 0,
        }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  reservationCard: {
    height: 124,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Color["grey100"],
    overflow: "hidden",
    flexDirection: "row",
    position: "relative",
    gap: 4,
  },
  creatorText: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 14,
    marginBottom: 8,
  },
  messageText: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 18,
  },
  timeText: {
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
    color: Color["grey400"],
  },
});
