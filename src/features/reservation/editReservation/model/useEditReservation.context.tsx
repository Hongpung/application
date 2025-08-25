import { createContext, useCallback, useContext, useMemo } from "react";
import { Alert } from "@hongpung/src/common";

import { isEqual } from "lodash";

import { ReservationStackScreenProps } from "@hongpung/src/common/navigation";

import {
  type ReservationForm,
  useEditReservationRequest,
  getReservationEditRequestBody,
} from "@hongpung/src/entities/reservation";

import useReservationForm from "../../configureReservation/model/useReservationForm";

import { EditReservationContextProps } from "./type";
import { editCompleteToast } from "../lib/toast";
import { useAtomValue } from "jotai";
import { UserStatusState } from "@hongpung/src/entities/member";
import { ensureReservationTitle } from "../../configureReservation/lib/ensureReservationTitle";
import { useReservationDifference } from "./useReservationDifference";
import { useQueryClient } from "@tanstack/react-query";

const EditReservationContext = createContext<
  EditReservationContextProps | undefined
>(undefined);

const EditReservationContextProvider: React.FC<
  {
    navigation: ReservationStackScreenProps<"EditReservation">["navigation"];
  } & {
    prevReservation: ReservationForm & { reservationId: number };
    children: React.ReactNode;
  }
> = ({ navigation, prevReservation, children }) => {
  const userData = useAtomValue(UserStatusState);

  const queryClient = useQueryClient();
  const { reservationForm, setForm, isCompleteReservation ,validateReservationForm} =
    useReservationForm(prevReservation);

  const { request, isLoading, error } = useEditReservationRequest();
  
  const isValidReservation = useMemo(
    () => isCompleteReservation(reservationForm),
    [reservationForm, isCompleteReservation],
  );

  // 변경된 필드들을 감지
  const differentKeys = useReservationDifference(reservationForm, prevReservation);

  // 예약 생성 API 요청 함수 (더미 함수로 예시)
  const verifyEditReservation = useCallback(
    async (onVerfyied: () => void) => {
      const validatedReservationForm = reservationForm as Required<ReservationForm>;
      
      const reservationFormCopy = ensureReservationTitle(
        validatedReservationForm,
        userData?.name,
        userData?.nickname
      );
      
      if (isEqual(prevReservation, reservationFormCopy)) {
        Alert.alert(
          "예약 오류", // 타이틀
          "기존 예약과 동일합니다.",
        );
      } else {
        onVerfyied();
      }
    },
    [reservationForm, prevReservation, userData],
  );

  const requestEditReservation = async () => {
    try {
      const { isValid, errors } = validateReservationForm(reservationForm);
      if (!isValid) throw Error(errors?.[0]?.message || "예약을 완벽히 작성해주세요.");
        
      const validatedReservationForm = reservationForm as Required<ReservationForm>;
      
      const reservationFormCopy = ensureReservationTitle(
        validatedReservationForm,
        userData?.name,
        userData?.nickname
      );

      if (isEqual(prevReservation, reservationFormCopy))
        throw new Error("기존 예약과 동일합니다.");

      console.log("예약 수정 요청", {
        reservationFormCopy,
      });
      await request(
        getReservationEditRequestBody(prevReservation, reservationFormCopy),
      );

      queryClient.invalidateQueries({ queryKey: ["reservation-detail", prevReservation.reservationId, "daily-reservations", prevReservation.date, reservationFormCopy.date] });

      navigation.navigate("ReservationDetail", {
        reservationId: prevReservation.reservationId,
      });

      editCompleteToast();
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert("예약 오류", e.message);
        console.error("예약 수정 중 오류 발생:", e.message);
      } else if (error instanceof Error) {
        Alert.alert(
          "예약 오류",
          error?.message || "예약 수정 중 오류가 발생했습니다.",
        );
        console.error("예약 수정 중 오류 발생:", error);
      } else {
        Alert.alert("예약 오류", "예약 수정 중 오류가 발생했습니다.");
        console.error("예약 수정 중 오류 발생:", error);
      }
    }
  };

  return (
    <EditReservationContext.Provider
      value={{
        prevReservation,
        reservation: reservationForm,
        differentKeys: differentKeys,
        ...setForm,

        isLoading,
        verifyEditReservation,
        requestEditReservation,
        isValidReservation,
      }}
    >
      {children}
    </EditReservationContext.Provider>
  );
};

// Context 사용을 위한 커스텀 훅
const useEditReservation = () => {
  const context = useContext(EditReservationContext);
  if (!context) {
    throw new Error(
      "useCreateReservation must be used within a CreateReservationContextProvider",
    );
  }
  return context;
};

export { EditReservationContextProvider, useEditReservation };
