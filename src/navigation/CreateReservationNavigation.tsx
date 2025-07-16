import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CreateReservationStackParamList } from "../common/navigation/createReservation";
import CreateReservationConfirmPage from "../pages/reservation/createReservationStack/CreateReservationConfirmPage";
import ReservationCreatePage from "../pages/reservation/createReservationStack/ReservationCreatePage";
import CreateReservationDateSelectScreen from "../pages/reservation/createReservationStack/CreateReservationDateSelectPage";
import CreateReservationTimeSelectScreen from "../pages/reservation/createReservationStack/CreateReservationTimeSelectPage";
import CreateReservationParticipatorsSelectScreen from "../pages/reservation/createReservationStack/CreateReservationParticipatorsSelectPage";
import CreateReservationBorrowInstrumentsSelectScreen from "../pages/reservation/createReservationStack/CreateReservationInstrumentsSelectPage";
import { CreateReservationContextProvider } from "../features/reservation/createReservation/model/useCreateReservation.context";

const CreateReservationStack =
  createNativeStackNavigator<CreateReservationStackParamList>();

export const CreateReservationNavigation: React.FC = () => {
  return (
    <CreateReservationContextProvider>
      <CreateReservationStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <CreateReservationStack.Screen
          name="CreateReservationForm"
          component={ReservationCreatePage}
        />
        <CreateReservationStack.Screen
          name="CreateReservationDateSelect"
          component={CreateReservationDateSelectScreen}
        />
        <CreateReservationStack.Screen
          name="CreateReservationTimeSelect"
          component={CreateReservationTimeSelectScreen}
        />
        <CreateReservationStack.Screen
          name="CreateReservationParticipatorsSelect"
          component={CreateReservationParticipatorsSelectScreen}
        />
        <CreateReservationStack.Screen
          name="CreateReservationBorrowInstrumentsSelect"
          component={CreateReservationBorrowInstrumentsSelectScreen}
        />
        <CreateReservationStack.Screen
          name="CreateReservationConfirm"
          component={CreateReservationConfirmPage}
        />
      </CreateReservationStack.Navigator>
    </CreateReservationContextProvider>
  );
};
