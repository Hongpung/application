import { type ReservationForm } from "@hongpung/src/entities/reservation";
import { completeReservationFormSchema } from "@hongpung/src/entities/reservation/model/reservationFormSchema";
import { useCallback, useMemo, useState } from "react";

const useReservationForm = (initialReservationForm?: ReservationForm) => {
  const [reservationForm, setReservationForm] = useState<ReservationForm>(
    initialReservationForm || {
      title: "",
      reservationType: "REGULAR",
      participationAvailable: false,
      borrowInstruments: [],
      participators: [],
      date: undefined,
      startTime: undefined,
      endTime: undefined,
    },
  );

  const isCompleteReservation = useCallback(
    (reservationForm: ReservationForm): reservationForm is Required<ReservationForm> => {
      const result = completeReservationFormSchema.safeParse(reservationForm);
      return result.success;
    },
    [],
  );

  const validateReservationForm = useCallback(
    (reservationForm: ReservationForm) => {
      const result = completeReservationFormSchema.safeParse(reservationForm);
      
      if (result.success) {
        return { 
          isValid: true, 
          data: result.data,
          errors: null 
        };
      } else {
        return { 
          isValid: false, 
          data: null,
          errors: result.error.issues,
          fieldErrors: result.error.flatten().fieldErrors
        };
      }
    },
    [],
  );

  // setReservation을 업데이트 함수로 개선
  // 각 필드에 대한 setter들을 묶어서 반환
  const setForm = useMemo(
    () => ({
      setDate: (date: ReservationForm["date"]) =>
        setReservationForm((prev) => ({
          ...prev,
          date,
          startTime: undefined,
          endTime: undefined,
        })),
      setStartTime: (startTime: ReservationForm["startTime"]) =>
        setReservationForm((prev) => ({
          ...prev,
          startTime,
          endTime: undefined,
        })),
      setEndTime: (endTime: ReservationForm["endTime"]) =>
        setReservationForm((prev) => ({
          ...prev,
          endTime,
        })),
      setTitle: (title: ReservationForm["title"]) =>
        setReservationForm((prev) => ({
          ...prev,
          title,
        })),
      setParticipators: (participators: ReservationForm["participators"]) =>
        setReservationForm((prev) => ({
          ...prev,
          participators,
        })),
      setBorrowInstruments: (
        borrowInstruments: ReservationForm["borrowInstruments"],
      ) =>
        setReservationForm((prev) => ({
          ...prev,
          borrowInstruments,
        })),
      setParticipationAvailable: (
        available: ReservationForm["participationAvailable"],
      ) =>
        setReservationForm((prev) => ({
          ...prev,
          participationAvailable: available,
        })),
      setReservationType: (type: ReservationForm["reservationType"]) =>
        setReservationForm((prev) => ({
          ...prev,
          reservationType: type,
        })),
    }),
    [],
  );

  return {
    reservationForm,
    isCompleteReservation,
    validateReservationForm,
    setForm,
  };
};

export default useReservationForm;
