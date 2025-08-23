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

import { useNavigation } from "@react-navigation/native";

import { Header, useBackBlock } from "@hongpung/src/common";

import { useResetPasswordSteps } from "@hongpung/src/features/auth/resetPassword";

import {
  ValidateEmailSection,
  ResetPasswordSection,
} from "@hongpung/src/widgets/auth";

const ResetPasswordPage: React.FC = () => {
  const navigation = useNavigation();

  const { ResetPasswordStep, emailValidationProps, resetPasswordProps } =
    useResetPasswordSteps();

  const { handleBackPress } = useBackBlock(() => {}, {
    title: "확인",
    message: "비밀번호 재설정을 취소하고 뒤로 돌아갈까요?",
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
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#FFF" }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={{ flex: 1, backgroundColor: "#FFF" }}>
          <Header LeftButton={"close"} leftAction={handleBackPress} />
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
                stepProps={emailValidationProps}
              />
              <ResetPasswordStep.Step
                name="ResetPassword"
                component={ResetPasswordSection}
                stepProps={{
                  ...resetPasswordProps,
                  resetPassword: async ({onSuccess, onError}) => {
                    await resetPasswordProps.resetPassword({
                      onSuccess: () => {
                        navigation.goBack();
                        onSuccess?.();
                      },
                      onError: () => {
                        onError?.();
                      },
                    });
                  },
                }}
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
