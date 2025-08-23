import { useRef } from "react";
import { useValidatedForm } from "@hongpung/src/common";
import { withdrawalSchema, type WithdrawalFormData } from "./withdrawalSchema";
import * as z from "zod";
import { useWithdrawRequest } from "@hongpung/src/entities/auth";
import { TextInput } from "react-native";

export const useWithdrawAuth = () => {
  const { request: withdrawRequest, isLoading } = useWithdrawRequest();

  const confirmwordRef = useRef<TextInput>(null);
  const currentPasswordRef = useRef<TextInput>(null);

  const   {
    getField,
    getValues,
    validateAll,
    isFormValid
  } = useValidatedForm({
    schema: withdrawalSchema,
    defaultValues: {
      confirmword: "",
      currentPassword: "",
    },
  });


  const handleWithdraw = async ({
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    try {
      const validation = await validateAll();
      if (validation === false) throw new Error("비밀번호가 일치하지 않습니다.");
      const { currentPassword } = getValues();
      await withdrawRequest({ password: currentPassword });
      onSuccess?.();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors;
        errors.forEach((err) => {
          const field = err.path[0] as keyof WithdrawalFormData;
          if (field === "confirmword") {
            confirmwordRef.current?.focus();
          } else if (field === "currentPassword") {
            currentPasswordRef.current?.focus();
          }
        });
      }
      onError?.();
    }
  };


  return {
    currentPasswordRef,
    confirmwordRef,
    getField,

    onWithdraw: handleWithdraw,
    isCanWithdraw: isFormValid,

    isWithdrawPending: isLoading,
  };
};
