import { useValidatedForm } from "@hongpung/src/common";
import {
  EditSNSAddressSchema,
  editSNSAddressSchema,
} from "./editSNSAddressSchema";

export const useEditSNSAdress = ({
  initialValues,
}: {
  initialValues: EditSNSAddressSchema;
}) => {
  const { instagramUrl, blogUrl } = initialValues;

  const form = useValidatedForm({
    schema: editSNSAddressSchema,
    defaultValues: {
      instagramUrl,
      blogUrl,
    },
    initialValidation: {
      instagramUrl: { state: "VALID" },
      blogUrl: { state: "VALID" },
    },
  });

  return { ...form };
};
