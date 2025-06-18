import React from "react";
import { LongButton, ValidationState } from "@hongpung/src/common";
import { BasicInput } from "@hongpung/src/common/ui/inputs/BasicInput";
import { TextInput, View } from "react-native";

interface WithdrawalAuthFormValue {
  confirmword: string;
  currentPassword: string;
}

type WithdrawalAuthFormValidation = {
  [key in keyof WithdrawalAuthFormValue]: ValidationState;
};

interface WithdrawalAuthFormProps {
  currentPasswordRef: React.RefObject<TextInput | null>;
  currentPassword: string;
  setCurrentPassword: (text: string) => void;
  currentPasswordValidation: WithdrawalAuthFormValidation["currentPassword"];
  onCurrentPasswordBlur: () => void;

  confirmwordRef: React.RefObject<TextInput | null>;
  confirmword: string;
  setConfirmword: (text: string) => void;
  confirmwordValidation: WithdrawalAuthFormValidation["confirmword"];
  onConfirmwordBlur: () => void;

  isCanWithdraw: boolean;
  onWithdraw: () => void;
}

export const WithdrawalAuthForm: React.FC<WithdrawalAuthFormProps> = (
  props,
) => {
  const {
    currentPasswordRef,
    currentPassword,
    setCurrentPassword,
    currentPasswordValidation,
    onCurrentPasswordBlur,

    confirmwordRef,
    confirmword,
    setConfirmword,
    confirmwordValidation,
    onConfirmwordBlur,

    isCanWithdraw,
    onWithdraw,
  } = props;

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 48, gap: 16 }}>
          <BasicInput
            ref={currentPasswordRef}
            label="비밀번호"
            isEncryption
            color="red"
            inputValue={currentPassword}
            setInputValue={setCurrentPassword}
            validationCondition={currentPasswordValidation}
            onBlur={onCurrentPasswordBlur}
          />
          <BasicInput
            ref={confirmwordRef}
            label="확인 문자"
            placeholder={`\"탈퇴하기\"를 입력해주세요.`}
            isEncryption
            color="red"
            inputValue={confirmword}
            setInputValue={setConfirmword}
            validationCondition={confirmwordValidation}
            onBlur={onConfirmwordBlur}
          />
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 12,
          paddingTop: 12,
          backgroundColor: "#FFF",
        }}
      >
        <LongButton
          color={"red"}
          innerContent="회원 탈퇴"
          isAble={isCanWithdraw}
          onPress={onWithdraw}
        />
      </View>
    </>
  );
};
