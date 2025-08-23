import React from "react";
import { FieldReturn, LongButton } from "@hongpung/src/common";
import { BasicInput } from "@hongpung/src/common/ui/inputs/BasicInput";
import { TextInput, View } from "react-native";

interface WithdrawalAuthFormValue {
  confirmword: string;
  currentPassword: string;
}

interface WithdrawalAuthFormProps {
  currentPasswordRef: React.RefObject<TextInput | null>;
  confirmwordRef: React.RefObject<TextInput | null>;
    getField: (fieldName: keyof WithdrawalAuthFormValue) => FieldReturn<WithdrawalAuthFormValue[keyof WithdrawalAuthFormValue]>;

  isCanWithdraw: boolean;
  onWithdraw: () => void;
}

export const WithdrawalAuthForm: React.FC<WithdrawalAuthFormProps> = (
  props,
) => {
  const {
    currentPasswordRef,
    confirmwordRef,
    getField,

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
            {...getField("currentPassword")}
          />
          <BasicInput
            ref={confirmwordRef}
            label="확인 문자"
            placeholder={`\"탈퇴하기\"를 입력해주세요.`}
            isEncryption
            color="red"
            {...getField("confirmword")}
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
