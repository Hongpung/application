import React from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  StyleSheet,
  ScrollView
} from "react-native";

import { DescriptionBox, Header } from "@hongpung/src/common";

import { useResetPasswordSteps } from "@hongpung/src/features/auth/resetPassword";

import { ResetPasswordForms } from "@hongpung/src/widgets/auth";

import { ResetPasswordDescriptions } from "./constant/descriptions";

const ResetPasswordPage: React.FC = () => {
  const { onClose, step, ...resetPasswordSteps } = useResetPasswordSteps();
  const StepForm = ResetPasswordForms[step];

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#FFF" }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={{ flex: 1, backgroundColor: "#FFF" }}>
          <Header leftButton={"close"} leftAction={onClose} />
          <Text style={styles.titleText}>비밀번호 재설정</Text>
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: "#FFF",
            }}
            contentContainerStyle={{
              flexGrow: 1,
              gap: 24,
            }}
          >
            <DescriptionBox descriptions={ResetPasswordDescriptions[step]} />
            <StepForm {...resetPasswordSteps} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ResetPasswordPage;

const styles = StyleSheet.create({
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
