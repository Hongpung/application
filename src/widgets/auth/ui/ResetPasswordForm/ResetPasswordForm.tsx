import type {
  ResetPasswordStepFormProps,
  ResetPasswordStep,
} from "@hongpung/src/features/auth/resetPassword";
import {
  EmailValidateForm,
  ResetPasswordForm,
} from "@hongpung/src/features/auth/resetPassword";

type ResetPasswordFormType = {
  [K in ResetPasswordStep]: React.FC<ResetPasswordStepFormProps<K>>;
};

export const ResetPasswordForms: ResetPasswordFormType = {
  EmailConfirm: EmailValidateForm,
  ResetPassword: ResetPasswordForm,
};
