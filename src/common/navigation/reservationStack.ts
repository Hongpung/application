import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import { MainStackNavigationProp } from "./mainStack";
import { EditReservationStackParamList } from "./editReservation";
import { CreateReservationStackParamList } from "./createReservation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
export type ReservationParamList = {
  ReservationCalendar: undefined;
  DailyReservationList: { date: string };
  ReservationDetail: { reservationId: number };
  EditReservation: {
    reservationJson: string;
  } & NavigatorScreenParams<EditReservationStackParamList>;
  CreateReservation?: NavigatorScreenParams<CreateReservationStackParamList>;
};

export type ReservationStackScreenProps<T extends keyof ReservationParamList> =
  {
    navigation: MainStackNavigationProp &
      NativeStackNavigationProp<ReservationParamList, T>;
    route: RouteProp<ReservationParamList, T>;
  };
