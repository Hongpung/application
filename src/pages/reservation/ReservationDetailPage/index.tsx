import { ScrollView, View, Text, Alert, StyleSheet } from "react-native";

import { DateTimeViewer } from "@hongpung/src/entities/reservation/ui/DateTimeViewer/DateTimeViewer";
import {
  BorrowInstrumentsViewer,
  ParticipatorsViewer,
  useLoadReservationDetailFetch,
} from "@hongpung/src/entities/reservation";
import { ReservationTypeViewer } from "@hongpung/src/entities/reservation/ui/ReservationTypeViewer/ReservationTypeViewer";
import { Header } from "@hongpung/src/common/ui/Header/Header";
import { useRecoilValue } from "recoil";
import { UserStatusState } from "@hongpung/src/entities/member";
import { Color } from "@hongpung/src/common";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { DeleteReservationButton } from "@hongpung/src/features/reservation/deleteReservation/ui/DeleteReservationButton/DeleteReservationButton";
import { isEditible } from "@hongpung/src/entities/reservation/lib/isEditible";
import { LeaveReservationButton } from "@hongpung/src/features/reservation/leaveReservation/ui/LeaveReservationButton/LeaveReservationButton";
import { EnterEditButton } from "@hongpung/src/features/reservation/editReservation/ui/EnterEditButton/EnterEditButton";
import { ReservationStackParamList } from "@hongpung/src/navigation/ReservationNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type ReservationDetailPageProps = NativeStackScreenProps<ReservationStackParamList, "ReservationDetail">;

const ReservationDetailPage: React.FC<ReservationDetailPageProps> = ({ navigation, route }) => {

  const { reservationId } = route.params;

  const {
    data: reservation,
    isLoading,
    error,
  } = useLoadReservationDetailFetch({ reservationId });
  const loginUser = useRecoilValue(UserStatusState);

  if (isLoading) {
    return (
      <View>
        <Header leftButton={"close"} HeaderName="예약 상세 정보" />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <SkeletonPlaceholder>
            <View>
              {/* 날짜 및 시간 */}
              <View
                style={[
                  { flexDirection: "column", gap: 16, paddingVertical: 24 },
                ]}
              >
                <View
                  style={{
                    height: 100,
                    marginHorizontal: 40,
                    backgroundColor: Color["grey100"],
                    borderRadius: 10,
                  }}
                />
              </View>

              <View style={styles.placeholderRow}>
                <View style={styles.placeholderLabel} />
                <View style={styles.placeholderValue} />
              </View>

              {/* 예약자 */}
              <View style={styles.placeholderRow}>
                <View style={styles.placeholderLabel} />
                <View style={styles.placeholderValue} />
              </View>

              {/* 예약명 */}
              <View style={styles.placeholderRow}>
                <View style={styles.placeholderLabel} />
                <View style={styles.placeholderValue} />
              </View>

              {/* 예약 유형 */}
              <View style={styles.placeholderRow}>
                <View style={styles.placeholderLabel} />
                <View style={styles.placeholderValue} />
              </View>

              {/* 참여자 */}
              <View style={styles.placeholderSection}>
                <View style={styles.placeholderLabel} />
                <View style={styles.placeholderListItem} />
                <View style={styles.placeholderListItem} />
              </View>

              {/* 대여 악기 */}
              <View style={styles.placeholderSection}>
                <View style={styles.placeholderLabel} />
                <View style={styles.placeholderListItem} />
                <View style={styles.placeholderListItem} />
              </View>
            </View>
          </SkeletonPlaceholder>
        </ScrollView>
      </View>
    );
  }
  if (!reservation) {
    Alert.alert("오류", "오류가 발생했습니다. 다시 시도해주세요.");
    navigation.goBack();

    return <View></View>;
  }

  const {
    date,
    startTime,
    endTime,
    title,
    borrowInstruments,
    creatorName,
    participationAvailable,
    participators,
    reservationType,
    creatorId,
    creatorNickname,
  } = reservation;

  if (reservationType === "EXTERNAL") {
    return (
      <View>
        <Header leftButton={"close"} HeaderName="예약 상세 정보" />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <DateTimeViewer date={date} startTime={startTime} endTime={endTime} />

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

          <View>
            <Text>예약유형</Text>
            <Text>외부 일정</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View>
      <Header leftButton={"close"} HeaderName="예약 상세 정보" />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <DateTimeViewer date={date} startTime={startTime} endTime={endTime} />

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

        <ParticipatorsViewer participators={participators} />

        <BorrowInstrumentsViewer borrowInstruments={borrowInstruments} />

        {/* 삭제하기 버튼 */}

        {creatorId === loginUser?.memberId && isEditible(date) && (
          <View>
            <DeleteReservationButton
              reservationId={reservationId}
              date={date}
            />
          </View>
        )}

        {/* 나가기 버튼 */}

        {creatorId !== loginUser?.memberId &&
          isEditible(date) &&
          participators.some(
            (participator) => participator.memberId === loginUser?.memberId
          ) && (
            <LeaveReservationButton reservationId={reservationId} date={date} />
          )}

        {/* 이 부분에 삭제하기/나가기 버튼 */}
      </ScrollView>

      {/* 수정하기 버튼 */}
      {creatorId !== loginUser?.memberId && isEditible(date) && (
        <View style={styles.bottomButton}>
          <EnterEditButton
            navigateToEditReservationPage={() =>{
            //   navigation.push("ReservationStack", {
            //     screen: "inReservation",
            //     params: { reservationId, date },
            //   })
            }}
          />
        </View>
      )}
    </View>
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
    flexDirection: "column",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
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

export default ReservationDetailPage;
