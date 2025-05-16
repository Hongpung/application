import { createContext, useContext } from "react";

import { useNavigation } from "@react-navigation/native";

import { Alert } from "@hongpung/src/common";
import { CreateReservationStackScreenProps } from "@hongpung/src/common/navigation";

import {
  parseReservationCreateRequestBody,
  useCreateReservationRequest,
} from "@hongpung/src/entities/reservation";

import useReservationForm from "../../configureReservation/model/useReservationForm";
import { CreateReservationContextProps } from "./type";


const CreateReservationContext = createContext<
  CreateReservationContextProps | undefined
>(undefined);

const CreateReservationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigation =
    useNavigation<
      CreateReservationStackScreenProps<"CreateReservationForm">["navigation"]
    >();

  const { request, error, isLoading } = useCreateReservationRequest();

  const { reservationForm, isCompleteReservation, setForm } =
    useReservationForm();

  const isValidReservation = isCompleteReservation(reservationForm);
  // 예약 생성 API 요청 함수 (더미 함수로 예시)
  const requestCreateReservation = async () => {
    try {
      if (!isValidReservation) throw Error("예약을 완벽히 작성해주세요.");

      const { reservationId } = await request(
        parseReservationCreateRequestBody(reservationForm)
      );

      navigation.replace("Reservation", {
        screen: "ReservationDetail",
        params: { reservationId },
      });
      // 실제 API 요청을 추가할 것
    } catch (e) {
      if (error instanceof Error) {
        Alert.alert(
          "예약 오류", // 타이틀
          error.message
        );
        console.error("예약 생성 중 오류 발생:", error.message);
      }
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
