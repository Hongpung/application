import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import { Color, Header } from "@hongpung/src/common";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useChangePasswordRequest } from "@hongpung/src/features/auth/changePassword/api/changePasswordApi";
import { ChangePasswordForm } from "@hongpung/src/features/auth/changePassword/ui/ChangePasswordForm/ChangePasswordForm";
import { changePasswordSuccessToast } from "@hongpung/src/features/auth/changePassword/lib/changeSuccessToast";

const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const { request: changePasswordRequest } = useChangePasswordRequest();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePassword = async () => {
    try {
      const { message } = await changePasswordRequest({
        currentPassword,
        newPassword,
      });
      if (!message) throw new Error("응답이 올바르지 않음");

      changePasswordSuccessToast()
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "비밀번호 변경 실패",
        "비밀번호 변경에 실패했습니다.\n" +
          (error instanceof Error
            ? error.message
            : "비밀번호 확인 후 다시 시도해주세요.")
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <Header leftButton={'close'} HeaderName="비밀번호 변경"/>
        <View
          style={{
            height: 40,
          }}
        ></View>
        <View
          style={styles.descriptionContainer}
        >
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
        <ChangePasswordForm
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          onChangePassword={changePassword}
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
