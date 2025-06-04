import React from "react";

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import { createStepFlow } from "@hongpung/react-step-flow";

import { Header } from "@hongpung/src/common";
import { LoginStackScreenProps } from "@hongpung/src/common/navigation";

import { useSignUpSteps } from "@hongpung/src/features/auth/signUp/model/useSignUpSteps";
import { SignUpStepPropsList } from "@hongpung/src/features/auth/signUp/model/type";

import {
  CreateNewPasswordSection,
  PersonalInfoSection,
  RegisterEmailSection,
} from "@hongpung/src/widgets/auth";

const SignUpStep = createStepFlow<SignUpStepPropsList>();

const SignUpPage: React.FC<LoginStackScreenProps<"SignUp">> = ({
  navigation,
}) => {
  const navigateToLoginPage = () => {
    navigation.navigate("Login");
  };
  const { onClose, setStep, step, dissmissClubOptions, ...signUpSteps } =
    useSignUpSteps({ navigateToLoginPage });

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
          <Header LeftButton={"close"} leftAction={onClose} />
          <Text style={styles.titleText}>회원가입</Text>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              backgroundColor: "#FFF",
              gap: 24,
            }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <SignUpStep.Container onStepChange={setStep} currentStep={step}>
              <SignUpStep.Step
                name="EmailConfirm"
                component={RegisterEmailSection}
                stepProps={{ ...signUpSteps }}
              />
              <SignUpStep.Step
                name="SetPassword"
                component={CreateNewPasswordSection}
                stepProps={{ ...signUpSteps }}
              />
              <SignUpStep.Step
                name="PersonalInfo"
                component={PersonalInfoSection}
                stepProps={{ ...signUpSteps }}
              />
            </SignUpStep.Container>
          </ScrollView>
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
