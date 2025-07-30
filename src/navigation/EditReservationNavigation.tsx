import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ReservationStackScreenProps } from "@hongpung/src/common/navigation";
import EditReservationDateSelectScreen from "@hongpung/src/pages/reservation/editReservationStack/EditReservationDateSelectPage";
import EditReservationTimeSelectScreen from "@hongpung/src/pages/reservation/editReservationStack/EditReservationTimeSelectPage";
import EditReservationParticipatorsSelectScreen from "@hongpung/src/pages/reservation/editReservationStack/EditReservationParticipatorsSelectPage";
import EditReservationBorrowInstrumentsSelectScreen from "@hongpung/src/pages/reservation/editReservationStack/EditReservationInstrumentsSelectPage";
import { EditReservationStackParamList } from "@hongpung/src/common/navigation/editReservation";
import EditReservationConfirmPage from "@hongpung/src/pages/reservation/editReservationStack/EditReservationConfirmPage";
import ReservationEditPage from "@hongpung/src/pages/reservation/editReservationStack/ReservationEditPage";
import { EditReservationContextProvider } from "@hongpung/src/features/reservation/editReservation/model/useEditReservation.context";
import { ReservationForm } from "@hongpung/src/entities/reservation";

const EditReservationStack =
  createNativeStackNavigator<EditReservationStackParamList>();

export const EditReservationNavigation: React.FC<
  ReservationStackScreenProps<"EditReservation">
> = ({ navigation, route }) => {
  const { reservationJson } = route.params;
  const prevReservation: ReservationForm & { reservationId: number } =
    JSON.parse(reservationJson);

  return (
    <EditReservationContextProvider
      navigation={navigation}
      prevReservation={prevReservation}
    >
      <EditReservationStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <EditReservationStack.Screen
          name="EditReservationForm"
          component={ReservationEditPage}
        />
        <EditReservationStack.Screen
          name="EditReservationDateSelect"
          component={EditReservationDateSelectScreen}
        />
        <EditReservationStack.Screen
          name="EditReservationTimeSelect"
          component={EditReservationTimeSelectScreen}
        />
        <EditReservationStack.Screen
          name="EditReservationParticipatorsSelect"
          component={EditReservationParticipatorsSelectScreen}
        />
        <EditReservationStack.Screen
          name="EditReservationBorrowInstrumentsSelect"
          component={EditReservationBorrowInstrumentsSelectScreen}
        />
        <EditReservationStack.Screen
          name="EditReservationConfirm"
          component={EditReservationConfirmPage}
        />
      </EditReservationStack.Navigator>
    </EditReservationContextProvider>
  );
};
