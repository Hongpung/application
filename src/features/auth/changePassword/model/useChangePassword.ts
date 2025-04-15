import { useRef, useState, useMemo } from "react";
import { ValidationState } from "@hongpung/src/common";
import { passwordSchema, type PasswordFormData } from "./passwordSchema";
import * as z from "zod";
import { useChangePasswordRequest } from "../api/changePasswordApi";
import { TextInput } from "react-native";

interface PasswordValue {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type PasswordFormValidation = {
  [key in keyof PasswordValue]: ValidationState;
};

export const useChangePassword = (): {
  currentPassword: string;
  setCurrentPassword: (text: string) => void;
  newPassword: string;
  setNewPassword: (text: string) => void;
  confirmPassword: string;
  setConfirmPassword: (text: string) => void;
  onChangePassword: () => Promise<void>;
  passwordValidation: PasswordFormValidation;
  validateConfirmPassword: (
    text: PasswordValue["confirmPassword"]
  ) => ValidationState;
  validateNewPassword: (text: PasswordValue["newPassword"]) => ValidationState;
  validateCurrentPassword: (
    text: PasswordValue["currentPassword"]
  ) => ValidationState;
  currentPasswordRef: React.RefObject<TextInput>;
  newPasswordRef: React.RefObject<TextInput>;
  confirmPasswordRef: React.RefObject<TextInput>;
  isCanChangePassword: boolean;
} => {
  const { request: ChangePasswordRequest } = useChangePasswordRequest();

  const currentPasswordRef = useRef<any | null>(null);
  const newPasswordRef = useRef<any | null>(null);
  const confirmPasswordRef = useRef<any | null>(null);

  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formValidation, setFormValidation] = useState<{
    [key in keyof PasswordFormData]: ValidationState;
  }>({
    currentPassword: { state: "BEFORE" },
    newPassword: { state: "BEFORE" },
    confirmPassword: { state: "BEFORE" },
  });

  const setForm = useMemo(
    () => ({
      setCurrentPassword: (currentPassword: string) => {
        setFormValidation((prev) => ({
          ...prev,
        currentPassword: { state: "PENDING" },
      }));
      setFormData((prev) => ({ ...prev, currentPassword }));
    },
    setNewPassword: (newPassword: string) => {
      setFormValidation((prev) => ({
        ...prev,
        newPassword: { state: "PENDING" },
      }));
      setFormData((prev) => ({ ...prev, newPassword }));
    },
    setConfirmPassword: (confirmPassword: string) => {
      setFormValidation((prev) => ({
        ...prev,
        confirmPassword: { state: "PENDING" },
      }));
        setFormData((prev) => ({ ...prev, confirmPassword }));
      },
    }),
    [setFormValidation]
  );

  const validateForm = useMemo(
    () => ({
      validateCurrentPassword: (currentPassword: string): ValidationState => {
        try {
          passwordSchema.innerType().shape.currentPassword.parse(currentPassword);
          return { state: "VALID" };
        } catch (error) {
          if (error instanceof z.ZodError) {
            return { state: "ERROR", errorText: error.errors[0].message };
          }
          return { state: "ERROR", errorText: "알 수 없는 오류가 발생했습니다." };
        }
      },
      validateNewPassword: (newPassword: string): ValidationState => {
        try {
          passwordSchema.innerType().shape.newPassword.parse(newPassword);
          return { state: "VALID" };
        } catch (error) {
          if (error instanceof z.ZodError) {
            return { state: "ERROR", errorText: error.errors[0].message };
          }
          return { state: "ERROR", errorText: "알 수 없는 오류가 발생했습니다." };
        }
      },
      validateConfirmPassword: (confirmPassword: string): ValidationState => {
        try {
          passwordSchema.innerType().shape.confirmPassword.parse(confirmPassword);
          if (confirmPassword !== formData.newPassword) {
            return { state: "ERROR", errorText: "비밀번호가 일치하지 않습니다." };
          }
          return { state: "VALID" };
        } catch (error) {
          if (error instanceof z.ZodError) {
            return { state: "ERROR", errorText: error.errors[0].message };
          }
          return { state: "ERROR", errorText: "알 수 없는 오류가 발생했습니다." };
        }
      },
    }),
    [formData]
  );

  const handleChangePassword = async () => {
    try {
      await passwordSchema.parseAsync(formData);
      await ChangePasswordRequest(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors;
        errors.forEach((err) => {
          const field = err.path[0] as keyof PasswordFormData;
          if (field === "currentPassword") {
            currentPasswordRef.current?.focus();
          } else if (field === "newPassword") {
            newPasswordRef.current?.focus();
          } else if (field === "confirmPassword") {
            confirmPasswordRef.current?.focus();
          }
          setFormValidation((prev) => ({
            ...prev,
            [field]: { state: "ERROR", errorText: err.message },
          }));
        });
      }
    }
  };

  const isFormValid = useMemo(() => {
    return (
      formValidation.currentPassword.state === "VALID" &&
      formValidation.newPassword.state === "VALID" &&
      formValidation.confirmPassword.state === "VALID"
    );
  }, [formValidation]);

  return {
    currentPassword: formData.currentPassword,
    newPassword: formData.newPassword,
    confirmPassword: formData.confirmPassword,
    ...setForm,
    ...validateForm,
    currentPasswordRef,
    newPasswordRef,
    confirmPasswordRef,
    onChangePassword: handleChangePassword,
    isCanChangePassword: isFormValid,
    passwordValidation: formValidation,
  };
};