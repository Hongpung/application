import { RouteProp } from "@react-navigation/native";
import { MainStackNavigationProp } from "./mainStack";

export type ReservationParamList = {
  ReservationCalendar: undefined;
  DailyReserveList: { date: string };
  ReservationDetail: { reservationId: number };
};

export type ReservationStackScreenProps<T extends keyof ReservationParamList> =
  {
    navigation: MainStackNavigationProp;
    route: RouteProp<ReservationParamList, T>;
  };
