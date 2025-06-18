import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
} from "react-native";
import { Header } from "@hongpung/src/common";

import { ChangePasswordSection } from "@hongpung/src/widgets/auth/ui/ChangePasswordSection/ChangePasswordSection";

const ChangePasswordScreen: React.FC = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Header LeftButton={"close"} />
        <Text style={styles.titleText}>비밀번호 변경</Text>
        <ChangePasswordSection />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  titleText: {
    paddingTop: 24,
    alignSelf: "flex-start",
    paddingHorizontal: 40,
    paddingBottom: 28,
    fontSize: 24,
    lineHeight: 26,
    fontFamily: "NanumSquareNeo-Bold",
  },
});
