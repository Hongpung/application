import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackNavigationProp } from "./mainStack";
import { RouteProp } from "@react-navigation/native";

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
  navigation: MainStackNavigationProp & NativeStackNavigationProp<EditReservationStackParamList, T>;
  route:  RouteProp<EditReservationStackParamList, T>
};
