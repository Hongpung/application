import { Color } from "@hongpung/src/common";
import SignUpNavigationButton from "@hongpung/src/features/auth/signUp/ui/SignUpNavigatorButton/SignUpNavigationButton";
import { LoginStackScreenProps } from "@hongpung/src/navigation/LoginStackNavigation";
import LoginSection from "@hongpung/src/widgets/auth/ui/LoginSection/LoginSection";
import { useCallback } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  StyleSheet,
  Platform,
} from "react-native";

const LoginPage: React.FC<LoginStackScreenProps<"Login">> = ({ navigation }) => {
  const navigateToSignUp = useCallback(() => {
    navigation.navigate("SignUp");
  }, [navigation]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#FFF" }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.container}>
          <Text style={styles.titleText}>로그인</Text>
          <LoginSection />
          <Text style={styles.interSectionText}>홍풍이 처음이시라면?</Text>
          <SignUpNavigationButton navigateToSignUp={navigateToSignUp} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    flex: 1,
    backgroundColor: "#FFF",
  },
  titleText: {
    alignSelf: "flex-start",
    paddingHorizontal: 40,
    paddingBottom: 28,
    fontSize: 24,
    lineHeight: 26,
    fontFamily: "NanumSquareNeo-Bold",
  },
  interSectionText: {
    fontSize: 16,
    lineHeight: 22,
    width: 300,
    height: 26,
    marginHorizontal: 48,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey600"],
    marginVertical: 16,
  },
});
