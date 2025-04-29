import {
  Platform,
  SafeAreaView as SafeView,
  StyleProp,
  ViewStyle,
  StyleSheet,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

export const SafeZone: React.FC<{
  children: any;
  style: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
  if (Platform.OS === "android")
    return (
      <SafeAreaView
        style={[style, Platform.OS === "android" ? styles.androidStyle : {}]}
      >
        <ExpoStatusBar style="auto" />
        {children}
      </SafeAreaView>
    );

  return (
    <SafeView style={style}>
      <StatusBar />
      {children}
    </SafeView>
  );
};

const styles = StyleSheet.create({
  androidStyle: {
    paddingBottom: 12,
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
