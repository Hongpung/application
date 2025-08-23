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

import { Header, useBackBlock } from "@hongpung/src/common";
import { LoginStackScreenProps } from "@hongpung/src/common/navigation";

import { useSignUpSteps } from "@hongpung/src/features/auth/signUp/model/useSignUpSteps";
import { SignUpStepPropsList } from "@hongpung/src/features/auth/signUp/model/type";
import { PersonalInfoFormData } from "@hongpung/src/features/auth/signUp/model/signUpSchema";

import {
  CreateNewPasswordSection,
  PersonalInfoSection,
  RegisterEmailSection,
} from "@hongpung/src/widgets/auth";

const SignUpPage: React.FC<LoginStackScreenProps<"SignUp">> = ({
  navigation,
}) => {
  const {
    SignUpStep,
    emailValidationStep,
    setNewPasswordStep,
    personalInfoStep,
    dissmissClubOptions,
  } = useSignUpSteps();

  const { handleBackPress } = useBackBlock(() => {}, {
    title: "확인",
    message: "회원가입을 취소하고 뒤로 돌아갈까요?",
    cancelText: "아니오",
    confirmText: "네",
    confirmButtonColor: "green",
    cancelButtonColor: "green",
    onConfirm: () => {
      navigation.goBack();
    },
  });
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
          <Header LeftButton={"close"} leftAction={handleBackPress} />
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
            <SignUpStep.Flow>
              <SignUpStep.Step
                name="EmailConfirm"
                component={RegisterEmailSection}
                stepProps={{ ...emailValidationStep }}
              />
              <SignUpStep.Step
                name="SetPassword"
                component={CreateNewPasswordSection}
                stepProps={{ ...setNewPasswordStep }}
              />
              <SignUpStep.Step
                name="PersonalInfo"
                component={PersonalInfoSection}
                stepProps={{
                  ...personalInfoStep,
                  signUp: async ({ onSuccess, onError }) => {
                    await personalInfoStep.signUp({
                      onSuccess: () => {
                        navigation.navigate("Login");
                        console.log("signUp 성공");
                        onSuccess?.();
                      },
                      onError: () => {
                        console.log("signUp 실패");
                        onError?.();
                      },
                    });
                  },
                }}
              />
            </SignUpStep.Flow>
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
