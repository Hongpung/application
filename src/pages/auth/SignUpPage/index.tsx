import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { DescriptionBox, Header } from "@hongpung/src/common";
import { useSignUpSteps } from "@hongpung/src/features/auth/signUp/model/useSignUpSteps";
import React from "react";
import { SignUpForms } from "@hongpung/src/widgets/auth/ui/SignUpForm/SignUpForm";
import { SignUpDescriptions } from "./constant/descriptions";

const SignUpPage: React.FC = () => {
  const { onClose, step, dissmissClubOptions, ...signUpSteps } =
    useSignUpSteps();
  const StepForm = SignUpForms[step];

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        dissmissClubOptions();
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#FFF" }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={{ flex: 1, backgroundColor: "#FFF" }}>
          <Header leftButton={"close"} leftAction={onClose} />
          <Text style={styles.titleText}>회원가입</Text>
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFF",
              gap: 24,
            }}
          >
            <DescriptionBox descriptions={SignUpDescriptions[step]} />
            <StepForm {...signUpSteps} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpPage;

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
