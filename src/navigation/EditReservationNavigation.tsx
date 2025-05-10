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
import {
  ReservationForm,
  useLoadReservationDetailFetch,
} from "@hongpung/src/entities/reservation";
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
