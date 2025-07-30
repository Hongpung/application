import { Header } from "@hongpung/src/common";
import { MainStackScreenProps } from "@hongpung/src/common/navigation";
import { View } from "react-native";
import WebView from "react-native-webview";

const WebViewPage: React.FC<MainStackScreenProps<"WebView">> = ({ route }) => {
  const { url, title } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <Header LeftButton="close" headerName={title} />
      <WebView
        bounces={false}
        source={{ uri: url }}
        style={{ flex: 1 }}
      ></WebView>
    </View>
  );
};

export default WebViewPage;
