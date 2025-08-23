import { FullScreenLoadingModal, LongButton } from "@hongpung/src/common";
import { BasicInput } from "@hongpung/src/common/ui/inputs/BasicInput";
import { View, StyleSheet } from "react-native";

import { ResetPasswordStepsProps } from "../../model/type";
import { StepProps } from "@hongpung/react-step-flow";

type ResetPasswordFormProps = StepProps<
  ResetPasswordStepsProps,
  "ResetPassword"
>;

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  stepProps: props,
  goTo,
}) => {
  const {
    getField,
    newPasswordRef,
    confirmPasswordRef,
    isCanResetPassword,
    resetPassword,
    isResetPasswordPending,
  } = props;

  return (
    <View style={styles.container}>
       <FullScreenLoadingModal
        isLoading={isResetPasswordPending}
      />
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <BasicInput
            ref={newPasswordRef}
            label="비밀번호"
            isEncryption
            color="green"
            {...getField("newPassword")}
          />
        </View>
        <View style={styles.inputGroup}>
          <BasicInput
            ref={confirmPasswordRef}
            label="비밀번호 확인"
            isEncryption
            color="green"
            {...getField("confirmPassword")}
          />
        </View>
      </View>
      <View
        style={styles.buttonContainer}
      >
        <LongButton
          color={"green"}
          innerContent="비밀번호 재설정"
          isAble={isCanResetPassword}
          onPress={() => {
            if(!isCanResetPassword) return;
            resetPassword({})
          }}
        />
      </View>
    </View>
  );
};

export default ResetPasswordForm;

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
