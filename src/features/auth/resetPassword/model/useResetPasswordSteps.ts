import { useStepFlow } from "@hongpung/react-step-flow";
import { ResetPasswordStepsProps } from "./type";
import { useEmailValdiationStep } from "./useEmailValdiationStep";
import { useSetNewPasswordStep } from "./useSetNewPasswordStep";

const useResetPasswordSteps = () => {
  const { currentStep, setCurrentStep, ...restStepFlow } =
  useStepFlow<ResetPasswordStepsProps>({
    initialStep: "EmailConfirm",
  });

  const emailValidationStep = useEmailValdiationStep();
  const resetPasswordStep = useSetNewPasswordStep({ email: emailValidationStep.getField("email").value });

  return {
    ResetPasswordStep: { ...restStepFlow },
    emailValidationProps: {
      ...emailValidationStep,
    },
    resetPasswordProps: {
      ...resetPasswordStep,
    },
  };
};

export default useResetPasswordSteps;
