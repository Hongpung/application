import Header from "@hongpung/components/common/Header";
import { MainStackParamList } from "@hongpung/nav/HomeStacks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import WebView from "react-native-webview";



type WebViewScreenProps = NativeStackScreenProps<MainStackParamList, "WebView">;

export const WebViewScreen: React.FC<WebViewScreenProps> = ({ route }) => {
    const { url, title } = route.params

    return (
        <View style={{ flex: 1 }}>
            <Header leftButton='close' HeaderName={title} />
            <WebView bounces={false} source={{uri:url}} style={{ flex:1 }}>
            </WebView>
        </View>
    )
}