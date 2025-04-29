import { useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "./resetPaswordSchema";
import { ValidationState } from "@hongpung/src/common";
import { z } from "zod";
import { useIsRegisteredEmailRequest } from "@hongpung/src/entities/auth";

const useResetPasswordForm = () => {
  const { request: isRegisteredEmail, isLoading: isRegisteredEmailLoading } =
    useIsRegisteredEmailRequest();

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formValidation, setFormValidation] = useState<{
    [key in keyof Required<ResetPasswordFormData>]: ValidationState;
  }>({
    email: { state: "BEFORE" },
    newPassword: { state: "BEFORE" },
    confirmPassword: { state: "BEFORE" },
  });

  const validations = useMemo(
    () => ({
      emailValidation: formValidation.email,
      newPasswordValidation: formValidation.newPassword,
      confirmPasswordValidation: formValidation.confirmPassword,
    }),
    [formValidation]
  );

  const setForm = useMemo(
    () => ({
      setEmail: (email: string) => {
        setFormValidation((prev) => ({
          ...prev,
          email: { state: "PENDING" },
        }));
        setFormData((prev) => ({ ...prev, email }));
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
    [setFormValidation, setFormData]
  );

  const validateForm = {
    validateEmail: async (email: string) => {
      try {
        await resetPasswordSchema.innerType().shape.email.parseAsync(email);
        console.log(email);
        const { isRegistered } = await isRegisteredEmail({ email });
        console.log(isRegistered);
        if (isRegistered === false) {
          setFormValidation((prev) => ({
            ...prev,
            email: {
              state: "ERROR",
              errorText: "존재하지 않는 이메일입니다.",
            },
          }));
          return false;
        }
        setFormValidation((prev) => ({
          ...prev,
          email: { state: "VALID" },
        }));
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          setFormValidation((prev) => ({
            ...prev,
            email: { state: "ERROR", errorText: error.errors[0].message },
          }));
        }
      }
    },
    validateNewPassword: (password: string) => {
      try {
        resetPasswordSchema.innerType().shape.newPassword.parse(password);
        setFormValidation((prev) => ({
          ...prev,
          newPassword: { state: "VALID" },
        }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setFormValidation((prev) => ({
            ...prev,
            password: { state: "ERROR", errorText: error.errors[0].message },
          }));
        }
      }
    },
    validateConfirmPassword: (confirmPassword: string) => {
      try {
        resetPasswordSchema
          .innerType()
          .shape.confirmPassword.parse(confirmPassword);
        if (confirmPassword !== formData.newPassword) {
          setFormValidation((prev) => ({
            ...prev,
            confirmPassword: {
              state: "ERROR",
              errorText: "비밀번호가 일치하지 않습니다.",
            },
          }));
          return;
        }
        setFormValidation((prev) => ({
          ...prev,
          confirmPassword: { state: "VALID" },
        }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setFormValidation((prev) => ({
            ...prev,
            confirmPassword: {
              state: "ERROR",
              errorText: error.errors[0].message,
            },
          }));
        }
      }
    },
  };

  return {
    ...formData,
    formValidation,
    ...setForm,
    ...validations,
    ...validateForm,
    setFormValidation,
  };
};

export default useResetPasswordForm;
