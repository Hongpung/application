import { ErrorModal, LongButton } from "@hongpung/src/common";
import { BasicInput } from "@hongpung/src/common/ui/inputs/BasicInput";
import { FullScreenLoadingModal } from "@hongpung/src/common/ui/LoadingModal/FullScreenLoadingModal";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { EmailValidateFormProps } from "../../model/type";

const EmailValidateForm: React.FC<EmailValidateFormProps> = (props) => {
  //이메일
  const {
    email,
    setEmail,
    emailValidation,
    validateEmail: valitateEmail,
    emailRef: emailInputRef,
  } = props;

  //이메일 인증 코드 발송
  const {
    sendVerificationCode,
    isSendingCode,
    isSendingCodeLoading,
    isSendingCodeError,
  } = props;

  //이메일 인증 코드 검증
  const {
    verificationCodeRef: verificationCodeInputRef,

    verificationCode,
    setVerificationCode,
    verificationCodeValidation,
    validateVerificationCode,

    isVerifyingCodeLoading,
    isVerifyingCodeError,

    verifyCode,
  } = props;

  return (
    <View style={styles.container}>
      <FullScreenLoadingModal
        isLoading={isVerifyingCodeLoading || isSendingCodeLoading}
      />
      <ErrorModal
        visible={isSendingCodeError !== null}
        title={"오류"}
        message={
          "이메일 인증번호 전송에 실패했어요.\n인터넷 확인 후 다시 시도해주세요."
        }
      />

      <ErrorModal
        visible={isVerifyingCodeError !== null}
        title={"오류"}
        message={
          "인증번호 검증에 실패했어요.\n인터넷 확인 후 다시 시도해주세요."
        }
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <View style={{ flex: 1 }}>
            <BasicInput
              ref={emailInputRef}
              inputValue={email}
              setInputValue={setEmail}
              label="이메일"
              color="green"
              isEditible={!isSendingCode}
              keyboardType={"email-address"}
              validationCondition={emailValidation}
              onBlur={() => valitateEmail(email)}
            />
          </View>
          <Pressable style={styles.button} onPress={sendVerificationCode}>
            <Text style={styles.buttonText}>
              {isSendingCode ? "인증번호\n재전송" : "인증번호\n전송"}
            </Text>
          </Pressable>
        </View>
        {isSendingCode && (
          <BasicInput
            ref={verificationCodeInputRef}
            label="인증 코드"
            keyboardType="number-pad"
            color="green"
            inputValue={verificationCode}
            setInputValue={setVerificationCode}
            validationCondition={verificationCodeValidation}
            onBlur={() => {
              validateVerificationCode(verificationCode);
            }}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <LongButton
          innerContent="이메일 인증"
          color="green"
          onPress={verifyCode}
          isAble={verificationCodeValidation.state === "VALID"}
        />
      </View>
    </View>
  );
};

export default EmailValidateForm;

const styles = StyleSheet.create({
  inputGroup: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    width: "100%",
    position: "relative",
  },
  button: {
    marginTop: 12,
    width: 60,
    height: 40,
    backgroundColor: "#3CB371",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3CB371",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontFamily: "NanumSquareNeo-Bold",
    textAlign: "center",
    lineHeight: 14,
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputContainer: {
    gap: 24,
    flexDirection: "column",
    width: "100%",
    flexGrow: 1,
    paddingHorizontal: 48,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 12,
  },
});
