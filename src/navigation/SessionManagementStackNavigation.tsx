import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UsingManageScreen } from "@hongpung/src/pages/session/UsingSessionManagePage";
import CheckOutSessionScreen from "@hongpung/src/pages/session/CheckOutPage";
import { SessionManagementParamList } from "@hongpung/src/common/navigation";

const SessionManagementStack =
  createNativeStackNavigator<SessionManagementParamList>();

export const SessionManagementStackNavigation: React.FC = () => {
  return (
    <SessionManagementStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SessionManagementStack.Screen
        options={{ presentation: "modal" }}
        name="SessionManage"
        component={UsingManageScreen}
      />
      <SessionManagementStack.Screen
        options={{ presentation: "formSheet" }}
        name="CheckOutSession"
        component={CheckOutSessionScreen}
      />
    </SessionManagementStack.Navigator>
  );
};
