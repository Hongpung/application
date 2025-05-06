import { ReservationForm } from "@hongpung/src/entities/reservation";

export type EditReservationContextProps = {
  prevReservation: ReservationForm;
  reservation: ReservationForm;

  setDate: (date: ReservationForm["date"]) => void;
  setStartTime: (time: ReservationForm["startTime"]) => void;
  setEndTime: (time: ReservationForm["endTime"]) => void;
  setTitle: (time: ReservationForm["title"]) => void;
  setParticipationAvailable: (
    participationAvailable: ReservationForm["participationAvailable"]
  ) => void;
  setReservationType: (
    reservationType: ReservationForm["reservationType"]
  ) => void;
  setParticipators: (participators: ReservationForm["participators"]) => void;
  setBorrowInstruments: (
    borrowInstruments: ReservationForm["borrowInstruments"]
  ) => void;

  verifyEditReservation: (onVerfyied: () => void) => Promise<void>;
  differentKeys: (keyof ReservationForm)[];

  requestEditReservation: () => Promise<void>;

  isLoading: boolean;
  isValidReservation: boolean;
};
