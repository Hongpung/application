import React from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import { useStepFlow } from "@hongpung/react-step-flow";

import { Header } from "@hongpung/src/common";

import {
  useResetPasswordSteps,
  ResetPasswordStepsProps,
} from "@hongpung/src/features/auth/resetPassword";

import {
  ValidateEmailSection,
  ResetPasswordSection,
} from "@hongpung/src/widgets/auth";

const ResetPasswordPage: React.FC = () => {
  const { onClose, step, ...resetPasswordSteps } = useResetPasswordSteps();

  const { currentStep, ...ResetPasswordStep } =
    useStepFlow<ResetPasswordStepsProps>({
      initialStep: "EmailConfirm",
      onStepChange: (step) => {},
    });

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
          <Header LeftButton={"close"} leftAction={onClose} />
          <Text style={styles.titleText}>비밀번호 재설정</Text>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              backgroundColor: "#FFF",
            }}
            contentContainerStyle={{
              flexGrow: 1,
              gap: 24,
            }}
          >
            <ResetPasswordStep.Flow>
              <ResetPasswordStep.Step
                name="EmailConfirm"
                component={ValidateEmailSection}
                stepProps={resetPasswordSteps}
              />
              <ResetPasswordStep.Step
                name="ResetPassword"
                component={ResetPasswordSection}
                stepProps={resetPasswordSteps}
              />
            </ResetPasswordStep.Flow>
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
