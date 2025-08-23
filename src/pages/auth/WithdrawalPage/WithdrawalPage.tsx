import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
} from "react-native";

import { Header } from "@hongpung/src/common";
import { WithdrawalSection } from "@hongpung/src/widgets/auth";
import { StackActions, useNavigation } from "@react-navigation/native";

const WithdrawalScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <Header LeftButton={"close"} />
        <Text style={styles.titleText}>회원 탈퇴</Text>
        <WithdrawalSection onWithdrawSuccess={() => {
          navigation.dispatch(StackActions.replace("LoginStack"));
        }} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default WithdrawalScreen;

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
