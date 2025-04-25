import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import TutorialScreen from "@hongpung/src/pages/tutorial/TutorialPage";
import PermissionScreen from "@hongpung/src/pages/permission/PermissionPage";
import {
  LoginStackNavigation as LoginStack,
  LoginStackParamList,
} from "./LoginStackNavigation";
import {
  MainStackNavigation as MainStack,
  MainStackParamList,
} from "./MainStackNavigation";
import { NavigationContainer } from "@react-navigation/native";

export type RootStackParamList = {
  Tutorial: undefined;
  Permission: undefined;
  LoginStack: ScreenParams<LoginStackParamList>;
  Main: ScreenParams<MainStackParamList>;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export const RootStackNavigation: React.FC<{
  startDomain: "Tutorial" | "Permission" | "LoginStack" | "Main";
}> = ({ startDomain = "Tutorial" }) => {
  return (
      <RootStack.Navigator initialRouteName={startDomain} screenOptions={{
        headerShown: false,
      }}>
        <RootStack.Screen name="Tutorial" component={TutorialScreen} />
        <RootStack.Screen name="Permission" component={PermissionScreen} />
        <RootStack.Screen name="LoginStack" component={LoginStack} />
        <RootStack.Screen name="Main" component={MainStack} />
      </RootStack.Navigator>
  );
};
