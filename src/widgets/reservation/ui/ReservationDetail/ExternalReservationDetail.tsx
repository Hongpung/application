import { Color, Header } from "@hongpung/src/common";
import {
  DateTimeViewer,
  ReservationDetail,
} from "@hongpung/src/entities/reservation";
import { View, ScrollView, Text, StyleSheet } from "react-native";

export const ExternalReservationDetail: React.FC<{
  reservation: ReservationDetail;
}> = ({ reservation }) => {
  const { date, startTime, endTime, title, creatorName } = reservation;
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Header LeftButton={"close"} headerName="예약 상세 정보" />
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
              <Text style={styles.value}>{`${creatorName}`}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>예약명</Text>
              <Text style={styles.value}>{title}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>예약 유형</Text>
              <Text style={styles.value}>외부 일정</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
