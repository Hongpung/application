import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type EditReservationStackParamList = {
  EditReservationForm: undefined;
  EditReservationDateSelect: undefined;
  EditReservationTimeSelect: undefined;
  EditReservationParticipatorsSelect: undefined;
  EditReservationBorrowInstrumentsSelect: undefined;
  EditReservationConfirm: undefined;
};

export type EditReservationStackScreenProps<
  T extends keyof EditReservationStackParamList
> = NativeStackScreenProps<EditReservationStackParamList, T>;
