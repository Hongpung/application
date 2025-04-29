import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList } from "@hongpung/src/common/navigation";

import TutorialScreen from "@hongpung/src/pages/tutorial/TutorialPage";
import PermissionScreen from "@hongpung/src/pages/permission/PermissionPage";

import { MainStackNavigation as MainStack } from "./MainStackNavigation";
import { LoginStackNavigation as LoginStack } from "./LoginStackNavigation";
import { NavigationContainer } from "@react-navigation/native";

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootStackNavigation: React.FC<{
  startDomain: "Tutorial" | "Permission" | "LoginStack" | "Main";
}> = ({ startDomain = "Tutorial" }) => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={startDomain}
        screenOptions={{
          headerShown: false,
        }}
      >
        <RootStack.Screen name="Tutorial" component={TutorialScreen} />
        <RootStack.Screen name="Permission" component={PermissionScreen} />
        <RootStack.Screen name="LoginStack" component={LoginStack} />
        <RootStack.Screen name="Main" component={MainStack} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
