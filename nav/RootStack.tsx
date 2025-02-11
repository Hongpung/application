import LoginScreen from "@hongpung/pages/Auth/Login/LoginScreen";
import { PasswordReset } from "@hongpung/pages/Auth/PWReset/PWReset";
import { SignUp } from "@hongpung/pages/Auth/SignUp/SignUpScreen";
import PermissionScreen from "@hongpung/pages/FirstInstall/Permission/Permission";
import TutorialScreen from "@hongpung/pages/FirstInstall/Tutorial/Tutorial";
import { RootStackParamList } from "@hongpung/pageTypes";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainStacks from "./HomeStacks";
import Header from "@hongpung/components/common/Header";
import { WebViewScreen } from "@hongpung/pages/share/WebViewScreen";

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootStacks: React.FC<{ startDomain: "Login" | "Tutorial" | "HomeStack" }> = ({ startDomain }) => {
    return (
        <RootStack.Navigator initialRouteName={startDomain} screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <RootStack.Screen name="Tutorial" component={TutorialScreen} />
            <RootStack.Screen name="Permission" component={PermissionScreen} options={{ animation: 'none' }} />
            <RootStack.Screen name="Login" component={LoginScreen} options={{ animation: 'none' }} />
            <RootStack.Screen name="PWReset" component={PasswordReset} options={{ headerShown: true, header: () => <Header leftButton='close' /> }} />
            <RootStack.Screen name="SignUp" component={SignUp} options={{ headerShown: true, header: () => <Header leftButton='close' /> }} />
            <RootStack.Screen name="HomeStack" component={MainStacks} options={{ animation: 'none' }} />
            <RootStack.Screen
                name="WebView"
                component={WebViewScreen}
                options={{ animation: 'none' }}
            />
        </RootStack.Navigator>
    )
}