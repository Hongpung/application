import { useValidatedForm } from "@hongpung/src/common";
import {
  type EditPersonalInfoSchema,
  editPersonalInfoSchema,
} from "./editPersonalInfoSchema";

export const useEditPersonalInfo = ({
  initialValues,
}: {
  initialValues: EditPersonalInfoSchema;
}) => {
  const { nickname, enrollmentNumber } = initialValues;

  const form = useValidatedForm({
    schema: editPersonalInfoSchema,
    defaultValues: {
      nickname,
      enrollmentNumber,
    },
    initialValidation: {
      nickname: { state: "VALID" },
      enrollmentNumber: { state: "VALID" },
    },
  });

  return { ...form };
};
