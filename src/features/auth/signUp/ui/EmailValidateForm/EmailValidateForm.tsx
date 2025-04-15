import { ErrorModal, LongButton, ValidationState } from "@hongpung/src/common";
import { BasicInput } from "@hongpung/src/common/ui/inputs/InputBaseComponent";
import { FullScreenLoadingModal } from "@hongpung/src/common/ui/LoadingModal/FullScreenLoadingModal";
import { View, TextInput, StyleSheet, Pressable, Text } from "react-native";

interface EmailValidateFormProps {
  emailInputRef: React.RefObject<TextInput>;
  verificationCodeInputRef: React.RefObject<TextInput>;

  email: string;
  setEmail: (email: string) => void;
  emailValidation: ValidationState;
  valitateEmail: (email: string) => void;

  //이메일 인증 코드 발송
  isSendingCode: boolean;
  isSendingCodeError: boolean;

  sendVerificationCode: () => void;
  isSendingCodeLoading: boolean;

  verificationCode: string;
  verificationCodeValidation: ValidationState;
  setVerificationCode: (code: string) => void;
  validateVerificationCode: (code: string) => void;

  verifyCode: () => void;
  isVerifyingCodeLoading: boolean;
  isVerifyingCodeError: boolean;
  isVerifyingCodeSuccess: boolean;

  isVerifyingCode: boolean;
}

const EmailValidateForm: React.FC<EmailValidateFormProps> = (props) => {
  //이메일
  const { email, setEmail, emailValidation, valitateEmail, emailInputRef } =
    props;

  //이메일 인증 코드 발송
  const {
    sendVerificationCode,
    isSendingCode,
    isSendingCodeLoading,
    isSendingCodeError,
  } = props;

  //이메일 인증 코드 검증
  const {
    verificationCodeInputRef,

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
        visible={isSendingCodeError}
        title={"오류"}
        message={
          "이메일 인증번호 전송에 실패했어요.\n인터넷 확인 후 다시 시도해주세요."
        }
      />

      <ErrorModal
        visible={isVerifyingCodeError}
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
        <BasicInput
          ref={emailInputRef}
          label="이메일"
          inputValue={email}
          setInputValue={setEmail}
          validationCondition={emailValidation}
          onBlur={() => {
            valitateEmail(email);
          }}
        />

        {isSendingCode && (
          <BasicInput
            ref={verificationCodeInputRef}
            label="인증 코드"
            inputValue={verificationCode}
            setInputValue={setVerificationCode}
            validationCondition={verificationCodeValidation}
            onBlur={() => {
              validateVerificationCode(verificationCode);
            }}
          />
        )}
      </View>

      <LongButton
        innerContent="이메일 인증"
        color="green"
        onPress={verifyCode}
      />
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
    paddingHorizontal: 48,
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputContainer: {
    gap: 24,
  },
});
