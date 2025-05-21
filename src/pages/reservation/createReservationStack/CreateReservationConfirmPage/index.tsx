import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { useAtomValue } from "jotai";

import {
  Alert,
  Color,
  Icons,
  Header,
  daysOfWeek,
  LongButton,
} from "@hongpung/src/common";

import { UserStatusState } from "@hongpung/src/entities/member";
import { reservationFormSubTitle } from "@hongpung/src/entities/reservation";
import { instrumentTypes } from "@hongpung/src/entities/instrument";

import { useCreateReservation } from "@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context";
import { CreateReservationStackScreenProps } from "@hongpung/src/common/navigation/createReservation";

const CreateReservationConfirmPage: React.FC<
  CreateReservationStackScreenProps<"CreateReservationConfirm">
> = ({ navigation }) => {
  const { reservation, isValidReservation, requestCreateReservation } =
    useCreateReservation();

  const loginUser = useAtomValue(UserStatusState);

  if (!isValidReservation) {
    Alert.alert("오류", "잘못된 접근입니다.");
    return (
      <View>
        <Header leftButton={"close"} headerName="작성 정보 확인" />
      </View>
    );
  }

  return (
    <View style={CreateReservationStyles.container}>
      <Header leftButton={"close"} headerName="작성 정보 확인" />
      <View style={{ flex: 1, paddingTop: "10%", gap: 24 }}>
        <View style={CreateReservationStyles.blockContainer}>
          <View style={CreateReservationStyles.rowItemContainer}>
            <Text style={CreateReservationStyles.leftText}>
              {reservationFormSubTitle.date}
            </Text>
            <Text style={CreateReservationStyles.rightText}>
              {reservation.date} (
              {daysOfWeek[new Date(reservation.date!).getDay()]})
            </Text>
          </View>
          <View style={CreateReservationStyles.rowItemContainer}>
            <Text style={CreateReservationStyles.leftText}>예약 시간</Text>
            <Text
              style={CreateReservationStyles.rightText}
            >{`${reservation.startTime} ~ ${reservation.endTime}`}</Text>
          </View>
          <View style={CreateReservationStyles.rowItemContainer}>
            <Text style={CreateReservationStyles.leftText}>예약자</Text>
            <Text style={CreateReservationStyles.rightText}>{`${
              loginUser?.nickname
                ? `${loginUser?.name}(${loginUser.nickname})`
                : loginUser?.name
            }`}</Text>
          </View>
          <View style={CreateReservationStyles.rowItemContainer}>
            <Text style={CreateReservationStyles.leftText}>예약명</Text>
            <Text style={CreateReservationStyles.rightText}>
              {reservation.title.length > 0
                ? reservation.title
                : `${
                    loginUser?.nickname ? loginUser.nickname : loginUser?.name
                  }의 연습`}
            </Text>
          </View>
        </View>

        <View style={CreateReservationStyles.blockContainer}>
          <View style={CreateReservationStyles.rowItemContainer}>
            <Text style={CreateReservationStyles.leftText}>예약 유형</Text>
            <Text style={CreateReservationStyles.rightText}>
              {reservation.reservationType === "REGULAR"
                ? "정기 연습"
                : "개인 연습"}{" "}
              ({reservation.participationAvailable ? "참여 가능" : "참여 불가"})
            </Text>
          </View>

          <View style={CreateReservationStyles.rowItemContainer}>
            <Text style={CreateReservationStyles.leftText}>참여자</Text>

            {reservation.participators.length > 0 ? (
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <Text
                  style={[CreateReservationStyles.rightText, { maxWidth: 156 }]}
                  numberOfLines={1}
                >
                  {reservation.participators
                    .slice(0, 3)
                    .map((user) => user.name)
                    .join(", ")}
                  {reservation.participators.length > 3 &&
                    `외 ${reservation.participators.length - 3}명`}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.push("ParticipatorList", {
                      participators: JSON.stringify(reservation.participators),
                    })
                  }
                >
                  <Icons
                    size={16}
                    color={Color["grey300"]}
                    name={"chevron-forward"}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <Text
                style={[
                  CreateReservationStyles.rightText,
                  { color: Color["grey300"] },
                ]}
              >
                {"없음"}
              </Text>
            )}
          </View>

          <View style={CreateReservationStyles.rowItemContainer}>
            <Text style={CreateReservationStyles.leftText}>대여 악기</Text>

            {reservation.borrowInstruments.length > 0 ? (
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <Text style={CreateReservationStyles.rightText}>
                  {instrumentTypes
                    .filter((type) => type != "징")
                    .map((type) => {
                      const instCount = reservation.borrowInstruments.filter(
                        (instrument) => {
                          if (
                            type === "기타" &&
                            instrument.instrumentType == "징"
                          ) {
                            return true;
                          } else if (instrument.instrumentType == type) {
                            return true;
                          }
                          return false;
                        }
                      ).length;
                      if (instCount > 0) return `${type} ${instCount}`;
                    })
                    .filter(Boolean)
                    .join(", ")}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("BorrowInstrumentList", {
                      borrowInstruments: JSON.stringify(
                        reservation.borrowInstruments
                      ),
                    });
                  }}
                >
                  <Icons
                    size={16}
                    color={Color["grey300"]}
                    name={"chevron-forward"}
                  ></Icons>
                </TouchableOpacity>
              </View>
            ) : (
              <Text
                style={[
                  CreateReservationStyles.rightText,
                  { color: Color["grey300"] },
                ]}
              >
                {"없음"}
              </Text>
            )}
          </View>
        </View>
      </View>
      <View
        style={{
          paddingTop: 24,
          backgroundColor: "#FFF",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        <LongButton
          color="blue"
          innerContent={"예약 만들기"}
          onPress={requestCreateReservation}
        />
      </View>
    </View>
  );
};

export default CreateReservationConfirmPage;

const CreateReservationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color["grey100"],
  },
  blockContainer: {
    borderRadius: 15,
    marginHorizontal: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#FFF",
  },
  rowItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 14,
  },
  leftText: {
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 16,
    color: Color["grey400"],
  },
  rightText: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 16,
    color: Color["grey700"],
  },
  subName: {
    fontSize: 16,
    color: Color["grey400"],
  },
});
