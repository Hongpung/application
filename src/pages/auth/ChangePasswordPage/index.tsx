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
import { useChangePasswordForm } from "@hongpung/src/features/auth/changePassword/model/useChangePassword";
import { MainStackScreenProps } from "@hongpung/src/common/navigation";

const ChangePasswordScreen: React.FC<MainStackScreenProps<"ChangePassword">> = ({
  navigation,
}) => {
  const changePasswordForm = useChangePasswordForm();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Header LeftButton={"close"} />
        <Text style={styles.titleText}>비밀번호 변경</Text>
        <ChangePasswordSection
          {...changePasswordForm}
          onChangePassword={async () => {
            await changePasswordForm.onChangePassword({
              onSuccess: () => {
                navigation.navigate("MainTab", {
                  screen: "MyPage",
                })
              },
              onError: () => {
                console.log("비밀번호 변경 실패");
              },
            });
          }}
        />
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
