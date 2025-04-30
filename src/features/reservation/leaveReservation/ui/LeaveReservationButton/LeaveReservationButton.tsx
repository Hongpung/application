import React from "react";
import { Alert } from "react-native";

import { useNavigation } from "@react-navigation/native";

import {
  ErrorModal,
  FullScreenLoadingModal,
  LongButton,
} from "@hongpung/src/common";

import {
  isEditible,
  useLeaveReservationRequest,
} from "@hongpung/src/entities/reservation";

interface LeaveReservationButtonProps {
  reservationId: number;
  date: string;
}

export const LeaveReservationButton: React.FC<LeaveReservationButtonProps> = ({
  date,
  reservationId,
}) => {
  const navigation = useNavigation();
  const { request, isLoading, error } = useLeaveReservationRequest();

  const onButtonPressed = async () => {
    if (!isEditible(date)) {
      Alert.alert("오류", "수정 가능한 시간이 아닙니다.");
      return;
    }

    Alert.alert(
      "확인",
      "정말 예약에서 나가시겠습니까?",
      [
        { text: "아니오", style: "cancel" },
        {
          text: "예",
          onPress: async () => {
            try {
              await request({ reservationId });
              navigation.goBack();
            } catch {
              Alert.alert("오류", "오류가 발생했습니다.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <ErrorModal
        visible={error !== null}
        title="오류"
        message={error?.message || "알 수 없는 오류가 발생했습니다."}
      />
      <FullScreenLoadingModal isLoading={isLoading} />
      <LongButton
        innerContent="예약에서 나가기"
        color="red"
        isAble={true}
        onPress={onButtonPressed}
      />
    </>
  );
};
