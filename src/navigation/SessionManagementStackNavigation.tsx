import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import SessionManagementScreen from "@hongpung/src/pages/session/UsingSessionManagePage";
import CheckOutSessionScreen from "@hongpung/src/pages/session/CheckOutPage";
import { MainStackParamList } from "./MainStackNavigation";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";

export type SessionManagementStackParamList = {
  SessionManage: undefined;
  CheckOutSession: undefined;
};

const SessionManagementStack =
  createNativeStackNavigator<SessionManagementStackParamList>();

type SessionManageNavigationProp<
  T extends keyof SessionManagementStackParamList
> = CompositeNavigationProp<
  NativeStackNavigationProp<SessionManagementStackParamList, T>,
  NativeStackNavigationProp<MainStackParamList,"SessionManagement">
>;

export type SessionManagementScreenProps<
  T extends keyof SessionManagementStackParamList
> = {
  navigation: SessionManageNavigationProp<T>;
  route: RouteProp<SessionManagementStackParamList, T>;
};

export const SessionManagementStackNavigation: React.FC = () => {
  return (
    <SessionManagementStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SessionManagementStack.Screen
        name="SessionManage"
        component={SessionManagementScreen}
      />
      <SessionManagementStack.Screen
        name="CheckOutSession"
        component={CheckOutSessionScreen}
      />
    </SessionManagementStack.Navigator>
  );
};
