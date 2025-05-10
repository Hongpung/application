import {
  isEditible,
  ReservationDetail,
  useDeleteReservationRequest,
} from "@hongpung/src/entities/reservation";
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

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

      Alert.alert(
        "확인",
        "정말 취소하시겠습니까?",
        [
          { text: "아니오", style: "cancel" },
          {
            text: "예",
            onPress: async () => {
              try {
                if (reservation.reservationId === undefined) {
                  Alert.alert("오류", "예약 정보를 찾을 수 없습니다.");
                  navigation.goBack();
                  return;
                }
                await request({ reservationId: reservation.reservationId });
                Toast.show({
                  text1: "예약이 취소되었습니다.",
                  type: "success",
                });
                navigation.goBack();
              } catch {
                Alert.alert("오류", "오류가 발생했습니다.");
              }
            },
          },
        ],
        { cancelable: true }
      );
    },
    [request, navigation]
  );

  return { onDeleteReservation, isLoading, error };
};
