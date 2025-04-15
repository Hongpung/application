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
import { Color, Header } from "@hongpung/src/common";

import { ChangePasswordSection } from "@hongpung/src/widgets/auth/ui/ChangePasswordSection/ChangePasswordSection";

const ChangePasswordScreen: React.FC = () => {
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <Header leftButton={"close"} HeaderName="비밀번호 변경" />
        <View
          style={{
            height: 40,
          }}
        ></View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            {"로그인에 사용할 비밀번호를 변경해요."}
          </Text>
          <Text style={styles.description}>
            {
              "새로운 비밀번호는 영문, 숫자, 특수문자를 포함한\n8~12자로 구성해야 해요."
            }
          </Text>
          <Text style={styles.description}>
            {"허용 특수문자: !,@,#,$,%,^,&,+,="}
          </Text>
        </View>
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
  description: {
    fontSize: 14,
    fontFamily: "NanumSquareNeo-Light",
    color: Color["grey500"],
  },
  descriptionContainer: {
    marginVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 36,
    backgroundColor: Color["grey100"],
    paddingVertical: 12,
    borderRadius: 5,
  },
});
