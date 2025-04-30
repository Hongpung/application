import { RouteProp } from "@react-navigation/native";
import { MainStackNavigationProp } from "./mainStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type CreateReservationStackParamList = {
  CreateReservationForm?: { date: string };
  CreateReservationDateSelect: undefined;
  CreateReservationTimeSelect: undefined;
  CreateReservationParticipatorsSelect: undefined;
  CreateReservationBorrowInstrumentsSelect: undefined;
  CreateReservationConfirm: undefined;
};

export type CreateReservationStackScreenProps<
  T extends keyof CreateReservationStackParamList
> = {
  navigation: MainStackNavigationProp &
    NativeStackNavigationProp<CreateReservationStackParamList, T>;
  route: RouteProp<CreateReservationStackParamList, T>;
};
