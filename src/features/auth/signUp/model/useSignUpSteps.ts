import { FieldReturn, useValidatedForm } from "@hongpung/src/common";
import { PersonalInfoFormData, signUpSchema } from "./signUpSchema";
import { useEmailValdiationStep } from "./useEmailValdiationStep";
import { useSetNewPasswordStep } from "./useSetNewPasswordStep";
import { usePersonalInfoStep } from "./usePersonalInfoStep";
import { useStepFlow } from "@hongpung/react-step-flow";
import { SignUpStepPropsList } from "./type";

export const useSignUpSteps = () => {
  const { currentStep, setCurrentStep, ...restStepFlow } =
    useStepFlow<SignUpStepPropsList>({
      initialStep: "EmailConfirm",
    });

  const { getField, getValues, trigger, isFormValid, validateAll } =
    useValidatedForm({
      schema: signUpSchema,
      defaultValues: {
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        club: undefined,
        enrollmentNumber: "",
        nickname: undefined,
      },
      initialValidation: {
        nickname: { state: "VALID" },
      },
      validateMode: "onBlur",
    });

  const emailValidationStep = useEmailValdiationStep({
    getField,
    getValues,
    validateAll: () => trigger(["email"]),
  });

  const setNewPasswordStep = useSetNewPasswordStep({
    getField,
    validateAll: () => trigger(["password", "confirmPassword"]),
  });

  const { dissmissClubOptions, ...personalInfoStep } = usePersonalInfoStep({
    getField,
    getValues: getValues,
    validateAll: validateAll,
    isFormValid,
  });

  return {
    SignUpStep: { ...restStepFlow },
    emailValidationStep,
    setNewPasswordStep,
    personalInfoStep,
    dissmissClubOptions,
  };
};
