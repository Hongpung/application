import { createContext, useContext, useMemo } from "react";

import { CommonActions, useNavigation } from "@react-navigation/native";

import { Alert } from "@hongpung/src/common";
import { CreateReservationStackScreenProps } from "@hongpung/src/common/navigation";

import {
  parseReservationCreateRequestBody,
  useCreateReservationRequest,
} from "@hongpung/src/entities/reservation";

import useReservationForm from "../../configureReservation/model/useReservationForm";
import { CreateReservationContextProps } from "./type";
import { useAtomValue } from "jotai";
import { UserStatusState } from "@hongpung/src/entities/member";
import { createCompleteToast } from "../lib/toast";
import { ReservationForm } from "@hongpung/src/entities/reservation/model/type";
import { ensureReservationTitle } from "../../configureReservation/lib/ensureReservationTitle";
import { useQueryClient } from "@tanstack/react-query";

const CreateReservationContext = createContext<
  CreateReservationContextProps | undefined
>(undefined);

const CreateReservationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userData = useAtomValue(UserStatusState);
  const navigation =
    useNavigation<
      CreateReservationStackScreenProps<"CreateReservationForm">["navigation"]
    >();

  const queryClient = useQueryClient();
  const { request, isLoading } = useCreateReservationRequest();

  const { reservationForm, isCompleteReservation, setForm, validateReservationForm } =
    useReservationForm();

  const isValidReservation = useMemo(
    () => isCompleteReservation(reservationForm),
    [reservationForm, isCompleteReservation]
  );

  console.log("isValidReservation", isValidReservation);
  console.log("reservationForm", reservationForm);
  // 예약 생성 API 요청 함수 (더미 함수로 예시)
  const requestCreateReservation = async () => {
    try {
      const { isValid, errors } = validateReservationForm(reservationForm);
      if (!isValid) throw Error(errors?.[0]?.message || "예약을 완벽히 작성해주세요.");
      
      // validation이 통과했다면 모든 필수 필드가 채워져 있다는 것이 보장됨
      const validatedReservationForm = reservationForm as Required<ReservationForm>;
      
      const reservationFormCopy = ensureReservationTitle(
        validatedReservationForm,
        userData?.name,
        userData?.nickname
      );

      console.log(reservationFormCopy);

      const { reservationId } = await request(
        parseReservationCreateRequestBody(reservationFormCopy)
      );

      queryClient.invalidateQueries({ queryKey: ["daily-reservations", reservationFormCopy.date] });

      createCompleteToast();

      navigation.dispatch(
        CommonActions.reset({
          index: 2,
          routes: [
            {
              name: "ReservationCalendar",
            },
            {
              name: "DailyReservationList",
              params: { date: reservationForm.date }, // CreateReservationForm에서 전달받은 date
            },
            {
              name: "ReservationDetail",
              params: { reservationId },
            },
          ],
        })
      );
      // 실제 API 요청을 추가할 것
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert(
          "예약 오류", // 타이틀
          e.message
        );
        console.error("예약 생성 중 오류 발생:", e.message);
      } else {
        Alert.alert(
          "예약 오류", // 타이틀
          "예약 생성 중 오류가 발생했어요."
        );
      }
    }
  };

  return (
    <CreateReservationContext.Provider
      value={{
        reservation: reservationForm,
        ...setForm,

        isValidReservation,
        requestCreateReservation,
        isLoading,
      }}
    >
      {children}
    </CreateReservationContext.Provider>
  );
};

// Context 사용을 위한 커스텀 훅
const useCreateReservation = () => {
  const context = useContext(CreateReservationContext);
  if (!context) {
    throw new Error(
      "useCreateReservation must be used within a CreateReservationContextProvider"
    );
  }
  return context;
};

export { CreateReservationContextProvider, useCreateReservation };
