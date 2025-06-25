import { Color } from "@hongpung/src/common";
import { UserStatusState } from "@hongpung/src/entities/member";
import {
  DateTimeViewer,
  ReservationTypeViewer,
  ParticipatorsViewer,
  BorrowInstrumentsViewer,
  isEditible,
  ReservationDetail,
} from "@hongpung/src/entities/reservation";
import { DeleteReservationButton } from "@hongpung/src/features/reservation/deleteReservation/ui/DeleteReservationButton/DeleteReservationButton";
import { EnterEditButton } from "@hongpung/src/features/reservation/editReservation/ui/EnterEditButton/EnterEditButton";
import { LeaveReservationButton } from "@hongpung/src/features/reservation/leaveReservation/ui/LeaveReservationButton/LeaveReservationButton";
import { useAtomValue } from "jotai";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";

type InternalReservationDetailType = Extract<
  ReservationDetail,
  { reservationType: Exclude<ReservationType, "EXTERNAL"> }
>;

interface ReservationStackScreenProps {
  reservation: InternalReservationDetailType;
  navigateToParticipatorList: (params: { participators: string }) => void;
  navigateToBorrowInstrumentList: (params: {
    borrowInstruments: string;
  }) => void;
  onDeleteReservation: (reservation: InternalReservationDetailType) => void;
  navigateToEditReservationPage: (reservationJson: string) => void;
}

export const InternalReservationDetail: React.FC<
  ReservationStackScreenProps
> = ({
  reservation,
  navigateToBorrowInstrumentList,
  navigateToParticipatorList,
  onDeleteReservation,
  navigateToEditReservationPage,
}) => {
  const loginUser = useAtomValue(UserStatusState);
  const {
    date,
    startTime,
    endTime,
    title,
    borrowInstruments,
    creatorName,
    participationAvailable,
    participators,
    creatorId,
    creatorNickname,
    reservationType,
    reservationId,
  } = reservation;

  return (
    <>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ gap: 24 }}>
        <View
          style={{
            gap: 24,
            backgroundColor: Color["grey100"],
          }}
        >
          <View
            style={{
              backgroundColor: "#FFF",
              paddingVertical: 12,
              paddingHorizontal: 12,
            }}
          >
            <DateTimeViewer
              date={date}
              startTime={startTime}
              endTime={endTime}
            />
          </View>
          <View
            style={{
              gap: 24,
              backgroundColor: "#FFF",
              paddingVertical: 24,
              paddingHorizontal: 12,
            }}
          >
            <View style={styles.row}>
              <Text style={styles.label}>예약자</Text>
              <Text style={styles.value}>{`${creatorName}${
                !!creatorNickname ? ` (${creatorNickname})` : ""
              }`}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>예약명</Text>
              <Text style={styles.value}>{title}</Text>
            </View>

            <ReservationTypeViewer
              reservationType={reservationType}
              participationAvailable={participationAvailable}
            />
          </View>
          <View
            style={{
              gap: 24,
              backgroundColor: "#FFF",
              paddingVertical: 24,
              paddingHorizontal: 12,
            }}
          >
            <View style={styles.row}>
              <Text style={styles.label}>참가 인원</Text>
            </View>
            <Pressable
              style={{ paddingHorizontal: 24 }}
              onPress={() => {
                if (participators.length > 0) {
                  navigateToParticipatorList({
                    participators: JSON.stringify(participators),
                  });
                }
              }}
            >
              <ParticipatorsViewer participators={participators} />
            </Pressable>

            <View style={styles.row}>
              <Text style={styles.label}>대여 악기</Text>
            </View>
            <Pressable
              onPress={() => {
                if (borrowInstruments.length > 0) {
                  navigateToBorrowInstrumentList({
                    borrowInstruments: JSON.stringify(borrowInstruments),
                  });
                }
              }}
            >
              <BorrowInstrumentsViewer borrowInstruments={borrowInstruments} />
            </Pressable>
          </View>
        </View>

        {/* 삭제하기 버튼 */}

        {
          // creatorId === loginUser?.memberId && isEditible(date) &&
          <DeleteReservationButton
            onButtonPressed={() => onDeleteReservation(reservation)}
          />
        }

        {/* 나가기 버튼 */}

        {creatorId !== loginUser?.memberId &&
          isEditible(date) &&
          participators.some(
            (participator) => participator.memberId === loginUser?.memberId,
          ) && (
            <LeaveReservationButton
              reservationId={reservationId!}
              date={date}
            />
          )}

        {/* 이 부분에 삭제하기/나가기 버튼 */}
      </ScrollView>

      {/* 수정하기 버튼 */}
      {creatorId === loginUser?.memberId && isEditible(date) && (
        <View style={styles.bottomButton}>
          <EnterEditButton
            navigateToEditReservationPage={() =>
              navigateToEditReservationPage(
                JSON.stringify({
                  ...reservation,
                  reservationId: reservation.reservationId!,
                }),
              )
            }
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  row: {
    marginHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey500"],
  },
  value: {
    marginHorizontal: 12,
    paddingVertical: 4,
    fontSize: 16,
    textAlign: "right",
  },
  bottomButton: {
    flexShrink: 0,
    backgroundColor: "#FFF",
    gap: 8,
    paddingTop: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginVertical: 12,
  },
  placeholderLabel: {
    width: "30%",
    height: 16,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  placeholderValue: {
    width: "50%",
    height: 16,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  placeholderSection: {
    marginHorizontal: 24,
    marginVertical: 16,
  },
  placeholderListItem: {
    width: "100%",
    height: 16,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
});
