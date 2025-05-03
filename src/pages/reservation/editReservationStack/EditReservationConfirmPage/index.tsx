import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useAtomValue } from "jotai";

import { Color, Icons } from "@hongpung/src/common";
import { Header } from "@hongpung/src/common";

import { UserStatusState } from "@hongpung/src/entities/member";

import {
  ReservationForm,
  reservationFormSubTitle,
} from "@hongpung/src/entities/reservation";
import { daysOfWeek } from "@hongpung/src/common/constant/dayOfWeek";
import { useNavigation } from "@react-navigation/native";
import { useEditReservation } from "@hongpung/src/features/reservation/editReservation/model/useEditReservation.context";
import { isEqual } from "lodash";
import { useRef } from "react";
import { EditReservationButton } from "@hongpung/src/features/reservation/editReservation/ui/EditReservationButton/EditReservationButton";
import { instrumentTypes } from "@hongpung/src/entities/instrument/constant/instrumentTypes";
import { EditReservationStackScreenProps } from "@hongpung/src/common/navigation/editReservation";

const EditReservationConfirmPage = () => {
  const {
    reservation,
    prevReservation,
    differentKeys,
    requestEditReservation,
  } = useEditReservation();

  if (!isEqual(reservation, prevReservation)) {
    Alert.alert("오류", "잘못된 접근입니다.");
    return (
      <View>
        <Header leftButton={"close"} headerName="예약 수정 정보 확인" />
      </View>
    );
  }

  return (
    <View style={EditReservationConfirmStyles.container}>
      <Header leftButton={"close"} headerName="예약 수정 정보 확인" />

      <ScrollView
        style={{ flexDirection: "column", gap: 24, paddingVertical: 24 }}
      >
        <DifferenceData
          reservation={prevReservation}
          keys={differentKeys}
          textColor={"grey400"}
        />

        <Icons name={"arrow-down"} color={Color["blue500"]} size={32} />

        <DifferenceData
          reservation={reservation}
          keys={differentKeys}
          textColor={"blue500"}
        />
      </ScrollView>

      <EditReservationButton isAgree={false} onPress={requestEditReservation} />
    </View>
  );
};

export default EditReservationConfirmPage;

const DifferenceData = ({
  reservation,
  keys,
  textColor,
}: {
  reservation: ReservationForm;
  keys: (keyof ReservationForm)[];
  textColor: keyof typeof Color;
}) => {
  const loginUser = useAtomValue(UserStatusState);
  const navigation = useNavigation<EditReservationStackScreenProps<"EditReservationConfirm">["navigation"]>();

  const timeRendered = useRef<boolean>(false);
  return (
    <View style={EditReservationConfirmStyles.blockContainer}>
      {(() => {
        // 시간 렌더링 여부 추적
        return keys.map((key) => {
          switch (key) {
            case "date":
              return (
                <View
                  key={key}
                  style={EditReservationConfirmStyles.rowItemContainer}
                >
                  <Text style={EditReservationConfirmStyles.leftText}>
                    {reservationFormSubTitle.date}
                  </Text>
                  <Text style={EditReservationConfirmStyles.rightText}>
                    {reservation.date} (
                    {daysOfWeek[new Date(reservation.date!).getDay()]})
                  </Text>
                </View>
              );
            case "startTime":
            case "endTime":
              if (timeRendered.current) return null; // 이미 렌더링했으면 무시
              timeRendered.current = true; // 한 번만 렌더링
              return (
                <View
                  key="time"
                  style={EditReservationConfirmStyles.rowItemContainer}
                >
                  <Text style={EditReservationConfirmStyles.leftText}>
                    예약 시간
                  </Text>
                  <Text
                    style={EditReservationConfirmStyles.rightText}
                  >{`${reservation.startTime} ~ ${reservation.endTime}`}</Text>
                </View>
              );
            case "title":
              return (
                <View
                  key={key}
                  style={EditReservationConfirmStyles.rowItemContainer}
                >
                  <Text style={EditReservationConfirmStyles.leftText}>
                    예약명
                  </Text>
                  <Text style={EditReservationConfirmStyles.rightText}>
                    {reservation.title.length > 0
                      ? reservation.title
                      : `${
                          loginUser?.nickname
                            ? loginUser.nickname
                            : loginUser?.name
                        }의 연습`}
                  </Text>
                </View>
              );
            case "participators":
              return (
                <View
                  key={key}
                  style={EditReservationConfirmStyles.rowItemContainer}
                >
                  <Text style={EditReservationConfirmStyles.leftText}>
                    참여자
                  </Text>
                  {reservation.participators.length > 0 ? (
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={[
                          EditReservationConfirmStyles.rightText,
                          { maxWidth: 156 },
                        ]}
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
                          navigation.navigate("ParticipatorList", {
                            participators: JSON.stringify(
                              reservation.participators
                            ),
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
                    <Text>없음</Text>
                  )}
                </View>
              );
            case "borrowInstruments":
              return (
                <View
                  key={key}
                  style={EditReservationConfirmStyles.rowItemContainer}
                >
                  <Text style={EditReservationConfirmStyles.leftText}>
                    대여 악기
                  </Text>
                  {reservation.borrowInstruments.length > 0 ? (
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <Text style={EditReservationConfirmStyles.rightText}>
                        {instrumentTypes
                          .filter((type) => type != "징")
                          .map((type) => {
                            const instCount =
                              reservation.borrowInstruments.filter(
                                (instrument) =>
                                  instrument.instrumentType == type
                              ).length;
                            if (instCount > 0) return `${type} ${instCount}`;
                          })
                          .filter(Boolean)
                          .join(", ")}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("BorrowInstrumentList", {
                            borrowInstruments: JSON.stringify(
                              reservation.borrowInstruments
                            ),
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
                        EditReservationConfirmStyles.rightText,
                        { color: Color["grey300"] },
                      ]}
                    >
                      없음
                    </Text>
                  )}
                </View>
              );
            default:
              return null;
          }
        });
      })()}
    </View>
  );
};

const EditReservationConfirmStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  blockContainer: {
    borderRadius: 15,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
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
