import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ReservationStackScreenProps } from "@hongpung/src/common/navigation";
import CreateReservationConfirmPage from "../pages/reservation/createReservationStack/CreateReservationConfirmPage";
import ReservationCreatePage from "../pages/reservation/createReservationStack/ReservationCreatePage";
import CreateReservationDateSelectScreen from "../pages/reservation/createReservationStack/CreateReservationDateSelectPage";
import CreateReservationTimeSelectScreen from "../pages/reservation/createReservationStack/CreateReservationTimeSelectPage";
import CreateReservationParticipatorsSelectScreen from "../pages/reservation/createReservationStack/CreateReservationParticipatorsSelectPage";
import CreateReservationBorrowInstrumentsSelectScreen from "../pages/reservation/createReservationStack/CreateReservationInstrumentsSelectPage";
import { EditReservationStackParamList } from "../common/navigation/editReservation";
import EditReservationConfirmPage from "../pages/reservation/editReservationStack/EditReservationConfirmPage";
import ReservationEditPage from "../pages/reservation/editReservationStack/ReservationEditPage";
import { EditReservationContextProvider } from "../features/reservation/editReservation/model/useEditReservation.context";
import {
  ReservationForm,
  useLoadReservationDetailFetch,
} from "../entities/reservation";
import { View } from "react-native";
import { ErrorModal, FullScreenLoadingModal } from "@hongpung/src/common";

const EditReservationStack =
  createNativeStackNavigator<EditReservationStackParamList>();

export const EditReservationNavigation: React.FC<
  ReservationStackScreenProps<"EditReservation">
> = ({ navigation, route }) => {
  const { reservationId } = route.params;

  const {
    data: prevReservation,
    error,
    isLoading,
  } = useLoadReservationDetailFetch({
    reservationId,
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <FullScreenLoadingModal isLoading={isLoading} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ErrorModal
          title="오류"
          visible={error !== null}
          message={error.message}
          onConfirm={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate("Reservation", {
                screen: "ReservationDetail",
                params: { reservationId },
              });
            }
          }}
        />
      </View>
    );
  }

  return (
    <EditReservationContextProvider
      navigation={navigation}
      prevReservation={{
        ...(prevReservation as ReservationForm),
        reservationId,
      }}
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
          component={CreateReservationDateSelectScreen}
        />
        <EditReservationStack.Screen
          name="EditReservationTimeSelect"
          component={CreateReservationTimeSelectScreen}
        />
        <EditReservationStack.Screen
          name="EditReservationParticipatorsSelect"
          component={CreateReservationParticipatorsSelectScreen}
        />
        <EditReservationStack.Screen
          name="EditReservationBorrowInstrumentsSelect"
          component={CreateReservationBorrowInstrumentsSelectScreen}
        />
        <EditReservationStack.Screen
          name="EditReservationConfirm"
          component={EditReservationConfirmPage}
        />
      </EditReservationStack.Navigator>
    </EditReservationContextProvider>
  );
};
