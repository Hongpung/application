import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useAtomValue } from "jotai";

import { Alert, Checkbox, Color, Icons, Header } from "@hongpung/src/common";

import { UserStatusState } from "@hongpung/src/entities/member";

import {
  ReservationForm,
  reservationFormSubTitle,
} from "@hongpung/src/entities/reservation";

import { useNavigation } from "@react-navigation/native";
import { useEditReservation } from "@hongpung/src/features/reservation/editReservation/model/useEditReservation.context";
import { isEqual } from "lodash";
import React, { useState } from "react";
import { EditReservationButton } from "@hongpung/src/features/reservation/editReservation/ui/EditReservationButton/EditReservationButton";
import { instrumentTypes } from "@hongpung/src/entities/instrument/constant/instrumentTypes";
import { EditReservationStackScreenProps } from "@hongpung/src/common/navigation/editReservation";
import dayjs from "dayjs";

const EditReservationConfirmPage: React.FC<
  EditReservationStackScreenProps<"EditReservationConfirm">
> = ({ navigation }) => {
  const {
    reservation,
    prevReservation,
    differentKeys,
    requestEditReservation,
  } = useEditReservation();

  const [isAgree, setAgree] = useState(false);

  if (isEqual(reservation, prevReservation)) {
    Alert.alert("오류", "잘못된 접근입니다.", {
      onConfirm: () => {
        navigation.goBack();
      },
    });
    return (
      <View>
        <Header LeftButton={"close"} headerName="예약 수정 정보 확인" />
      </View>
    );
  }

  return (
    <View style={EditReservationConfirmStyles.container}>
      <Header LeftButton={"close"} headerName="예약 수정 정보 확인" />

      <ScrollView
        style={{
          flexDirection: "column",
          gap: 24,
          paddingVertical: 24,
          backgroundColor: Color["grey100"],
        }}
      >
        <DifferenceData
          reservation={prevReservation}
          keys={differentKeys}
          textColor={"grey400"}
        />

        <Icons
          name={"arrow-down"}
          color={Color["blue500"]}
          size={32}
          style={{ alignSelf: "center", paddingVertical: 8 }}
        />

        <DifferenceData
          reservation={reservation}
          keys={differentKeys}
          textColor={"blue500"}
        />
      </ScrollView>

      <View style={{ flexDirection: "column", gap: 16, paddingTop: 16 }}>
        <View style={{ paddingHorizontal: 32 }}>
          <Checkbox
            isChecked={isAgree}
            onCheck={setAgree}
            innerText="작성하신 내용이 위와 같나요?"
          />
        </View>
        <EditReservationButton
          isAgree={isAgree}
          onPress={requestEditReservation}
        />
      </View>
    </View>
  );
};

export default EditReservationConfirmPage;

const DifferenceData = ({
  reservation,
  keys,
  textColor = "grey100",
}: {
  reservation: ReservationForm;
  keys: (keyof Omit<ReservationForm, "startTime" | "endTime"> | "time")[];
  textColor?: keyof typeof Color & string;
}) => {
  const loginUser = useAtomValue(UserStatusState);
  const navigation =
    useNavigation<
      EditReservationStackScreenProps<"EditReservationConfirm">["navigation"]
    >();

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
                  <Text
                    style={[
                      EditReservationConfirmStyles.rightText,
                      { color: Color[textColor] },
                    ]}
                  >
                    {dayjs(reservation.date).format("YYYY.MM.DD (ddd)")}
                  </Text>
                </View>
              );
            case "time":
              return (
                <View
                  key="time"
                  style={EditReservationConfirmStyles.rowItemContainer}
                >
                  <Text style={EditReservationConfirmStyles.leftText}>
                    예약 시간
                  </Text>
                  <Text
                    style={[
                      EditReservationConfirmStyles.rightText,
                      { color: Color[textColor] },
                    ]}
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
                  <Text
                    style={[
                      EditReservationConfirmStyles.rightText,
                      { color: Color[textColor] },
                    ]}
                  >
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
                          { color: Color[textColor] },
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
                              reservation.participators,
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
                        { color: Color[textColor] },
                      ]}
                    >
                      없음
                    </Text>
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
                      <Text
                        style={[
                          EditReservationConfirmStyles.rightText,
                          { color: Color[textColor] },
                        ]}
                      >
                        {instrumentTypes
                          .filter((type) => type !== "징")
                          .map((type) => {
                            const instCount =
                              reservation.borrowInstruments.filter(
                                (instrument) =>
                                  instrument.instrumentType === type,
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
                              reservation.borrowInstruments,
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
                        { color: Color[textColor] },
                      ]}
                    >
                      없음
                    </Text>
                  )}
                </View>
              );
            case "reservationType":
              return (
                <View
                  key={key}
                  style={EditReservationConfirmStyles.rowItemContainer}
                >
                  <Text style={EditReservationConfirmStyles.leftText}>
                    정규 예약
                  </Text>
                  <Text
                    style={[
                      EditReservationConfirmStyles.rightText,
                      { color: Color[textColor] },
                    ]}
                  >
                    {reservation.reservationType === "REGULAR"
                      ? "예"
                      : "아니오"}
                  </Text>
                </View>
              );

            case "participationAvailable":
              return (
                <View
                  key={key}
                  style={EditReservationConfirmStyles.rowItemContainer}
                >
                  <Text style={EditReservationConfirmStyles.leftText}>
                    열린 연습
                  </Text>
                  <Text
                    style={[
                      EditReservationConfirmStyles.rightText,
                      { color: Color[textColor] },
                    ]}
                  >
                    {reservation.participationAvailable ? "예" : "아니오"}
                  </Text>
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
