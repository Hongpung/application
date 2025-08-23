import { ErrorModal, LongButton } from "@hongpung/src/common";
import { BasicInput } from "@hongpung/src/common/ui/inputs/BasicInput";
import { FullScreenLoadingModal } from "@hongpung/src/common/ui/LoadingModal/FullScreenLoadingModal";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { ResetPasswordStepsProps } from "../../model/type";
import { StepProps } from "@hongpung/react-step-flow";

type ValidateEmailSectionProps = StepProps<
  ResetPasswordStepsProps,
  "EmailConfirm"
>;

const EmailValidateForm: React.FC<ValidateEmailSectionProps> = ({
  stepProps: props,
  goTo,
}) => {
  //이메일
  const {
    emailRef,
    verificationCodeRef,
    getField,
    isCanSendVerificationCode,
    sendVerificationCode,
    isSendVerificationCodePending,
    isSendCode,
    isVerifyingCodePending,
    verifyCode,
    isCanVerifyCode,
  } = props;

  return (
    <View style={styles.container}>
      <FullScreenLoadingModal
        isLoading={isVerifyingCodePending || isSendVerificationCodePending}
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <View style={{ flex: 1 }}>
            <BasicInput
              label="이메일"
              ref={emailRef}
              color="green"
              isEditible={!isSendCode}
              keyboardType={"email-address"}
              {...getField("email")}
            />
          </View>
          <Pressable style={styles.button} onPress={() => {
            if(!isCanSendVerificationCode) return;
            sendVerificationCode({})
          }}>
            <Text style={styles.buttonText}>
              {isSendCode ? "인증번호\n재전송" : "인증번호\n전송"}
            </Text>
          </Pressable>
        </View>
        {isSendCode && (
          <BasicInput
            label="인증 코드"
            keyboardType="number-pad"
            color="green"
            ref={verificationCodeRef}
            {...getField("verificationCode")}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <LongButton
          innerContent="이메일 인증"
          color="green"
          onPress={() =>{
            console.log("press");
            verifyCode({
              onSuccess: () => {
                console.log("success");
                goTo("ResetPassword");
              }
            })}
          }
          isAble={isCanVerifyCode}
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
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 12,
  },
});
