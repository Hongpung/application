import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackNavigationProp } from "./mainStack";

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
> = {
  navigation: MainStackNavigationProp;
  route:  NativeStackScreenProps<EditReservationStackParamList, T>
};
