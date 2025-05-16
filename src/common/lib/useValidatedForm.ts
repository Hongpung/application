import { useState, useCallback, useMemo } from "react";
import { ZodObject, ZodRawShape, TypeOf, ZodSchema } from "zod";
import { ValidationState } from "../types/ValidationState";

type ValidationMap<T extends Record<string, any>> = {
  [K in keyof T as `${string & K}Validation`]: ValidationState;
};

export function createFieldSetters<T extends Record<string, any>>(
  initialFormData: T,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setFormValidation: React.Dispatch<React.SetStateAction<ValidationMap<T>>>
): {
  [K in keyof T as `set${Capitalize<string & K>}`]: (v: T[K]) => void;
} & {
    [K in keyof T as `set${Capitalize<string & K>}Validation`]: (
      newValidation: ValidationState
    ) => void;
  } {
  const setterMap = {} as {
    [K in keyof T as `set${Capitalize<string & K>}`]: (v: T[K]) => void;
  };
  const validationSetterMap = {} as {
    [K in keyof T as `set${Capitalize<string & K>}Validation`]: (
      newValidation: ValidationState
    ) => void;
  };

  (Object.keys(initialFormData) as (keyof T)[]).forEach((key) => {
    const methodName = `set${(key as string)
      .charAt(0)
      .toUpperCase()}${(key as string).slice(1)}` as keyof typeof setterMap;

    const validationName = `set${(key as string)
      .charAt(0)
      .toUpperCase()}${(key as string).slice(1)}Validation` as keyof typeof validationSetterMap;

    setterMap[methodName] = ((value: T[typeof key]) => {
      setFormValidation((prev) => ({
        ...prev,
        [`${key as string}Validation`]: { state: "PENDING" },
      }));
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }) as (typeof setterMap)[typeof methodName];

    validationSetterMap[validationName] = ((newValidation: ValidationState) => {
      setFormValidation((prev) => ({
        ...prev,
        [`${key as string}Validation`]: newValidation,
      }));
    }) as (typeof validationSetterMap)[typeof validationName];
  });

  return { ...setterMap, ...validationSetterMap };
}

export function useValidatedForm<S extends ZodObject<ZodRawShape>>({
  schema,
  defaultValues,
  initialValidation = {},
}: {
  schema: S;
  defaultValues: TypeOf<S>;
  initialValidation?: Partial<Record<keyof TypeOf<S>, ValidationState>>
}) {
  type InputFormType = TypeOf<S>;

  const [formData, setFormData] = useState<InputFormType>(defaultValues);
  const [formValidation, setFormValidation] = useState<
    ValidationMap<InputFormType>
  >(
    Object.entries(defaultValues).reduce((acc, [key]) => {
      return {
        ...acc,
        [`${key}Validation`]: initialValidation?.[key as keyof InputFormType] ?? {
          state: "BEFORE",
        },
      };
    }, {} as ValidationMap<InputFormType>)
  );

  const fieldSetters = useMemo(
    () => createFieldSetters(defaultValues, setFormData, setFormValidation),
    [defaultValues, setFormData, setFormValidation]
  );

  const fieldValidators = useMemo(() => {
    const validators = {} as {
      [K in keyof InputFormType as `validate${Capitalize<
        string & K
      >}`]: () => void;
    };

    (Object.keys(defaultValues) as (keyof InputFormType)[]).forEach((key) => {
      const methodName = `validate${(key as string).charAt(0).toUpperCase()}${(
        key as string
      ).slice(1)}` as keyof typeof validators;

      validators[methodName] = (() => {
        const fieldSchema = (schema.shape as any)[key];
        const result = fieldSchema.safeParse(formData[key]);

        if (result.success) {
          setFormValidation((prev) => ({
            ...prev,
            [`${key as string}Validation`]: { state: "VALID" },
          }));
        } else {
          setFormValidation((prev) => ({
            ...prev,
            [`${key as string}Validation`]: {
              state: "ERROR",
              errorText: result.error.errors[0].message,
            },
          }));
        }
      }) as (typeof validators)[typeof methodName];
    });

    return validators;
  }, [formData, schema]);

  console.log(formData, formValidation);

  return {
    ...formData,
    ...formValidation,

    ...fieldSetters,
    ...fieldValidators,
  };
}
