import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Color } from '@hongpung/src/common';
import { Reservation } from '@hongpung/src/entities/reservation';
import { useRecoilValue } from 'recoil';
import { UserStatusState } from '@hongpung/src/entities/member';

interface ReservationTicketProps {
  reservation: Reservation;
  onPressTicket: (reservationId: number) => void;
}

const ReservationTicket: React.FC<ReservationTicketProps> = ({
  reservation,
  onPressTicket,
}) => {
  const loginUser = useRecoilValue(UserStatusState);
  const isCreator = reservation.creatorId === loginUser?.memberId;

  return (
    <Pressable
      style={[
        styles.reservationCard,
        { backgroundColor: isCreator ? Color['blue100'] : Color['green100'] }
      ]}
      onPress={()=>onPressTicket(reservation.reservationId)}
    >
      <Text style={styles.creatorText}>
        {isCreator ? '내가 만든 일정' : '참가하는 일정'}
      </Text>
      <Text style={styles.messageText} numberOfLines={1} ellipsizeMode="tail">
        {reservation.title}
      </Text>
      <Text style={styles.timeText}>
        {reservation.startTime}~{reservation.endTime}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  reservationCard: {
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
  },
  creatorText: {
    fontFamily: 'NanumSquareNeo-Bold',
    fontSize: 14,
    marginBottom: 8,
  },
  messageText: {
    fontFamily: 'NanumSquareNeo-Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  timeText: {
    fontFamily: 'NanumSquareNeo-Regular',
    fontSize: 14,
    color: Color['grey400'],
  },
});

export default ReservationTicket; 