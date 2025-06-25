import {
  isEditible,
  ReservationDetail,
  useDeleteReservationRequest,
} from "@hongpung/src/entities/reservation";
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { Alert } from "@hongpung/src/common";
import { deleteCompleteToast } from "../lib/toast";

export const useDeleteReservation = () => {
  const navigation = useNavigation();
  const { request, isLoading, error } = useDeleteReservationRequest();

  const onDeleteReservation = useCallback(
    async (reservation: ReservationDetail) => {
      if (!reservation) {
        Alert.alert("오류", "예약 정보를 찾을 수 없습니다.");
        navigation.goBack();
        return;
      }

      if (!isEditible(reservation.date)) {
        Alert.alert("오류", "취소 가능한 시간이 아닙니다.");
        return;
      }

      Alert.confirm("확인", "정말 취소하시겠습니까?", {
        cancelText: "아니오",
        confirmText: "예",
        onConfirm: async () => {
          try {
            if (reservation.reservationId === undefined) {
              Alert.alert("오류", "예약 정보를 찾을 수 없습니다.");
              navigation.goBack();
              return;
            }

            await request({ reservationId: reservation.reservationId });

            deleteCompleteToast();
            navigation.goBack();
          } catch {
            Alert.alert("오류", "오류가 발생했습니다.");
          }
        },
      });
    },
    [request, navigation],
  );

  return { onDeleteReservation, isLoading, error };
};
