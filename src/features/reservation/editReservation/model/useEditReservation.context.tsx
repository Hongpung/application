import { createContext, useCallback, useContext, useMemo } from "react";
import { Alert } from "react-native";

import { isEqual } from "lodash";

import { ReservationStackScreenProps } from "@hongpung/src/common/navigation";

import {
  type ReservationForm,
  useEditReservationRequest,
  getReservationEditRequestBody,
} from "@hongpung/src/entities/reservation";

import useReservationForm from "../../configureReservation/model/useReservationForm";

import { EditReservationContextProps } from "./type";

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
  const { reservationForm, setForm, isCompleteReservation } =
    useReservationForm();

  const { request, isLoading, error } = useEditReservationRequest();
  // setReservation을 업데이트 함수로 개선

  const isValidReservation = useMemo(
    () => isCompleteReservation(reservationForm),
    [reservationForm]
  );
  // 예약 생성 API 요청 함수 (더미 함수로 예시)
  const verifyEditReservation = useCallback(
    async (onVerfyied: () => void) => {
      if (isEqual(prevReservation, reservationForm)) {
        Alert.alert(
          "예약 오류", // 타이틀
          "기존 예약과 동일합니다."
        );
      } else {
        onVerfyied();
      }
    },
    [reservationForm]
  );

  const differenceKey = useMemo(() => {
    if (!reservationForm) return [];

    if (!prevReservation) return []; // 초기 상태면 전체 반환
    const diff: (keyof ReservationForm)[] = [];

    for (const key of Object.keys(
      reservationForm
    ) as (keyof ReservationForm)[]) {
      if (reservationForm[key] !== prevReservation[key]) {
        diff.push(key);
      }
    }

    return diff;
  }, [reservationForm]);

  const requestEditReservation = async () => {
    try {
      if (!isValidReservation) throw Error("예약을 완벽히 작성해주세요.");

      if (isEqual(prevReservation, reservationForm))
        throw new Error("기존 예약과 동일합니다.");

      await request(
        getReservationEditRequestBody(prevReservation, reservationForm)
      );
      navigation.navigate("ReservationDetail", {
        reservationId: prevReservation.reservationId,
      });
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert("예약 오류", e.message);
        console.error("예약 수정 중 오류 발생:", e.message);
      } else if (error instanceof Error) {
        Alert.alert(
          "예약 오류",
          error?.message || "예약 수정 중 오류가 발생했습니다."
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
        differentKeys: differenceKey,
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
      "useCreateReservation must be used within a CreateReservationContextProvider"
    );
  }
  return context;
};

export { EditReservationContextProvider, useEditReservation };
