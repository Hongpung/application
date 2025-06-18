import { View, StyleSheet, Pressable, Text } from "react-native";

import { StepProps } from "@hongpung/react-step-flow";

import {
  LongButton,
  BasicInput,
  FullScreenLoadingModal,
} from "@hongpung/src/common";

import { SignUpStepPropsList } from "../../model/type";

type EmailValidateFormProps = StepProps<SignUpStepPropsList, "EmailConfirm">;

export const EmailValidateForm: React.FC<EmailValidateFormProps> = ({
  stepProps: props,
  goTo,
}) => {
  //이메일
  const {
    email,
    setEmail,
    emailValidation,
    validateEmail,
    emailRef: emailInputRef,
  } = props;

  //이메일 인증 코드 발송
  const { sendVerificationCode, isSendingCode, isSendingCodeLoading } = props;

  //이메일 인증 코드 검증
  const {
    verificationCodeRef: verificationCodeInputRef,

    verificationCode,
    setVerificationCode,
    verificationCodeValidation,
    validateVerificationCode,

    isVerifyingCodeLoading,

    verifyCode,
  } = props;

  return (
    <View style={styles.container}>
      <FullScreenLoadingModal
        isLoading={isVerifyingCodeLoading || isSendingCodeLoading}
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
              onBlur={validateEmail}
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
              console.log(verificationCode);
              validateVerificationCode(verificationCode);
            }}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <LongButton
          innerContent="이메일 인증"
          color="green"
          onPress={() =>
            verifyCode({
              onSuccess: () => {
                goTo("SetPassword");
              },
            })
          }
          isAble={verificationCodeValidation.state === "VALID"}
        />
      </View>
    </View>
  );
};

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
