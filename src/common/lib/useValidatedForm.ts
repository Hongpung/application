import { useState, useMemo } from "react";
import { ZodType } from "zod";
import { ValidationState } from "../types/ValidationState";

type ValidationMap<T extends Record<string, any>> = {
  [K in keyof Required<T> as `${string & K}Validation`]: ValidationState;
};

export const createFieldSetters = <T extends Record<string, any>>(
  initialFormData: T,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setFormValidation: React.Dispatch<React.SetStateAction<ValidationMap<T>>>,
): {
  [K in keyof Required<T> as `set${Capitalize<string & K>}`]: (v: T[K]) => void;
} & {
  [K in keyof Required<T> as `set${Capitalize<string & K>}Validation`]: (
    newValidation: ValidationState,
  ) => void;
} => {
  const setterMap = {} as {
    [K in keyof Required<T> as `set${Capitalize<string & K>}`]: (
      v: T[K],
    ) => void;
  };
  const validationSetterMap = {} as {
    [K in keyof Required<T> as `set${Capitalize<string & K>}Validation`]: (
      newValidation: ValidationState,
    ) => void;
  };

  (Object.keys(initialFormData) as (keyof T)[]).forEach((key) => {
    const methodName = `set${(key as string).charAt(0).toUpperCase()}${(
      key as string
    ).slice(1)}` as keyof typeof setterMap;

    const validationName = `set${(key as string).charAt(0).toUpperCase()}${(
      key as string
    ).slice(1)}Validation` as keyof typeof validationSetterMap;

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
};

export const useValidatedForm = <T extends Record<string, any>>({
  schema,
  defaultValues,
  initialValidation = {},
  asyncValidator = {},
}: {
  schema: ZodType<T>;
  defaultValues: T;
  asyncValidator?: Partial<
    Record<keyof T, (value: T[keyof T]) => Promise<string | undefined>>
  >;
  initialValidation?: Partial<Record<keyof T, ValidationState>>;
}) => {
  type InputFormType = T;

  const [formData, setFormData] = useState<InputFormType>(defaultValues);
  const [formValidation, setFormValidation] = useState<
    ValidationMap<InputFormType>
  >(
    Object.entries(defaultValues).reduce(
      (acc, [key]) => {
        return {
          ...acc,
          [`${key}Validation`]: initialValidation?.[
            key as keyof InputFormType
          ] ?? {
            state: "BEFORE",
          },
        };
      },
      {} as ValidationMap<Required<InputFormType>>,
    ),
  );

  const fieldSetters = useMemo(
    () => createFieldSetters(defaultValues, setFormData, setFormValidation),
    [defaultValues, setFormData, setFormValidation],
  );

  const fieldValidators = useMemo(() => {
    const validators = {} as {
      [K in keyof Required<InputFormType> as `validate${Capitalize<
        string & K
      >}`]: () => void;
    };

    (Object.keys(defaultValues) as (keyof Required<InputFormType>)[]).forEach(
      (key) => {
        const methodName =
          `validate${(key as string).charAt(0).toUpperCase()}${(
            key as string
          ).slice(1)}` as keyof typeof validators;

        validators[methodName] = (() => {
          // 전체 스키마로 검증
          const result = schema.safeParse(formData);

          if (result.success) {
            setFormValidation((prev) => ({
              ...prev,
              [`${key as string}Validation`]: { state: "VALID" },
            }));
          } else {
            // 해당 필드의 에러를 찾기 (refine 에러 포함)
            const fieldError = result.error.issues.find((issue) => {
              // 직접 경로 매칭
              if (issue.path.length > 0 && issue.path[0] === key) {
                return true;
              }
              // 경로가 비어있는 경우 (전체 객체 검증 에러)
              if (issue.path.length === 0) {
                return false;
              }
              // path 배열에 문자열로 포함되어 있는지 확인
              return issue.path.some((pathItem) => pathItem === key);
            });

            if (fieldError) {
              setFormValidation((prev) => ({
                ...prev,
                [`${key as string}Validation`]: {
                  state: "ERROR",
                  errorText: fieldError.message,
                },
              }));
            } else {
              // 해당 필드에 직접적인 에러가 없으면 VALID로 설정
              setFormValidation((prev) => ({
                ...prev,
                [`${key as string}Validation`]: { state: "VALID" },
              }));
            }
          }
        }) as (typeof validators)[typeof methodName];
      },
    );

    return validators;
  }, [formData, schema, defaultValues]);

  return {
    ...formData,
    ...formValidation,

    ...fieldSetters,
    ...fieldValidators,
  };
};
