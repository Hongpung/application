import { SignUpStep, StepFormProps } from "@hongpung/src/features/auth/signUp/model/type";
import EmailValidateForm from "@hongpung/src/features/auth/signUp/ui/EmailValidateForm/EmailValidateForm";
import { PersonalInfoForm } from "@hongpung/src/features/auth/signUp/ui/PersonalInfoForm/PersonalInfoForm";
import { SetPasswordForm } from "@hongpung/src/features/auth/signUp/ui/SetPasswordForm/SetPasswordForm";

type SignUpFormsType = {
  [K in SignUpStep]: React.FC<StepFormProps<K>>;
};

export const SignUpForms: SignUpFormsType = {
  EmailConfirm: EmailValidateForm,
  Password: SetPasswordForm,
  PersonalInfo: PersonalInfoForm,
};