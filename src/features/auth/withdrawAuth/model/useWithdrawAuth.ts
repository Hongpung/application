import { useRef, useMemo } from "react";
import { useValidatedForm } from "@hongpung/src/common";
import { withdrawalSchema, type WithdrawalFormData } from "./withdrawalSchema";
import * as z from "zod";
import { useWithdrawRequest } from "@hongpung/src/entities/auth";
import { TextInput } from "react-native";

export const useWithdrawAuth = () => {
  const { request: withdrawRequest } = useWithdrawRequest();

  const confirmwordRef = useRef<TextInput>(null);
  const currentPasswordRef = useRef<TextInput>(null);

  const formDatas = useValidatedForm({
    schema: withdrawalSchema,
    defaultValues: {
      confirmword: "",
      currentPassword: "",
    },
  });

  const {
    confirmword,
    setConfirmword,
    confirmwordValidation,
    validateConfirmword,

    currentPassword,
    setCurrentPassword,
    currentPasswordValidation,
    validateCurrentPassword,
  } = formDatas;

  const handleWithdraw = async () => {
    try {
      await withdrawalSchema.parseAsync({ confirmword, currentPassword });
      await withdrawRequest({ password: currentPassword });
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
    }
  };

  const onBlur = useMemo(() => {
    return {
      onCurrentPasswordBlur: () => {
        if (currentPasswordValidation.state !== "BEFORE")
          validateCurrentPassword();
      },
      onConfirmwordBlur: () => {
        if (confirmwordValidation.state !== "BEFORE") validateConfirmword();
      },
    };
  }, [
    currentPasswordValidation,
    confirmwordValidation,
    validateCurrentPassword,
    validateConfirmword,
  ]);

  const isFormValid = useMemo(() => {
    return (
      currentPasswordValidation.state === "VALID" &&
      confirmwordValidation.state === "VALID"
    );
  }, [currentPasswordValidation, confirmwordValidation]);

  return {
    currentPassword,
    confirmword,
    setCurrentPassword,
    setConfirmword,
    currentPasswordRef,
    confirmwordRef,
    validateConfirmword,
    validateCurrentPassword,
    currentPasswordValidation,
    confirmwordValidation,

    ...onBlur,
    onWithdraw: handleWithdraw,
    isCanWithdraw: isFormValid,
  };
};
