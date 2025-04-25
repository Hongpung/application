import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Color, Header, DescriptionBox } from "@hongpung/src/common";

import { ChangePasswordSection } from "@hongpung/src/widgets/auth/ui/ChangePasswordSection/ChangePasswordSection";

const ChangePasswordScreen: React.FC = () => {
  const descriptions = [
    "로그인에 사용할 비밀번호를 변경해요.",
    "새로운 비밀번호는 영문, 숫자, 특수문자를 포함한\n8~12자로 구성해야 해요.",
    "허용 특수문자: !,@,#,$,%,^,&,+,=",
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <Header leftButton={"close"} headerName="비밀번호 변경" />
        <View
          style={{
            height: 40,
          }}
        ></View>
        <DescriptionBox descriptions={descriptions} style={styles.descriptionContainer} />
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
});
