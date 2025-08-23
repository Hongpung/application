import { useState, useMemo, useCallback } from "react";
import { ZodType } from "zod";
import { ValidationState } from "../../types/ValidationState";

type ValidationMap<T extends Record<string, unknown>> = {
  [K in keyof Required<T> as `${string & K}Validation`]: ValidationState;
};

export type FieldReturn<T> = {
  value: T;
  setValue: (value: T) => void;
  validation: ValidationState;
  setValidation: (validation: ValidationState) => void;
  validate: () => void;
  error?: string;
  onChange?: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
};

export const createFieldSetters = <T extends Record<string, unknown>>(
  initialFormData: T,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setFormValidation: React.Dispatch<React.SetStateAction<ValidationMap<T>>>
): {
  [K in keyof Required<T> as `set${Capitalize<string & K>}`]: (v: T[K]) => void;
} & {
  [K in keyof Required<T> as `set${Capitalize<string & K>}Validation`]: (
    newValidation: ValidationState
  ) => void;
} => {
  const setterMap = {} as {
    [K in keyof Required<T> as `set${Capitalize<string & K>}`]: (
      v: T[K]
    ) => void;
  };
  const validationSetterMap = {} as {
    [K in keyof Required<T> as `set${Capitalize<string & K>}Validation`]: (
      newValidation: ValidationState
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

export const useValidatedForm = <T extends Record<string, unknown>>({
  schema,
  defaultValues,
  initialValidation = {},
  validateMode = "onBlur",
}: {
  schema: ZodType<T>;
  defaultValues: T;
  initialValidation?: Partial<Record<keyof T, ValidationState>>;
  validateMode?: "onBlur" | "onChange" | "onSubmit";
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
      {} as ValidationMap<Required<InputFormType>>
    )
  );

  const fieldSetters = useMemo(
    () => createFieldSetters(defaultValues, setFormData, setFormValidation),
    [defaultValues, setFormData, setFormValidation]
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
      }
    );

    return validators;
  }, [formData, schema, defaultValues]);

  // getField 함수 - 특정 필드의 API를 반환
  const getField = useCallback(
    <T extends keyof InputFormType>(
      fieldName: T
    ): FieldReturn<InputFormType[T]> => {
      const key = String(fieldName) as string & keyof InputFormType;
      const validationKey =
        `${key}Validation` as keyof ValidationMap<InputFormType>;
      const validation = formValidation[validationKey] as ValidationState;
      const value = formData[fieldName] as InputFormType[T];

      const setValue = fieldSetters[
        `set${key.charAt(0).toUpperCase()}${key.slice(1)}` as keyof typeof fieldSetters
      ] as (value: InputFormType[T]) => void;

      const setValidation = fieldSetters[
        `set${key.charAt(0).toUpperCase()}${key.slice(1)}Validation` as keyof typeof fieldSetters
      ] as (validation: ValidationState) => void;

      const validate = fieldValidators[
        `validate${key.charAt(0).toUpperCase()}${key.slice(1)}` as keyof typeof fieldValidators
      ] as () => void;

      return {
        value,
        setValue,
        validation,
        setValidation,
        validate,
        error: validation.state === "ERROR" ? validation.errorText : undefined,
        onChange: (text: string) => {
          setValue(text as InputFormType[T]);
          if (validateMode === "onChange") {
            validate();
          }
        },
        onBlur: () => {
          if (validateMode === "onBlur") {
            validate();
            console.log(formValidation)
          }
        },
        onFocus: () => {
          setValidation({ state: "PENDING" });
        },
      };
    },
    [formData, formValidation, fieldSetters, fieldValidators, validateMode]
  );

  //validateAll 함수 - 모든 필드를 검증
  const validateAll = useCallback(async () => {
    const result = await schema.safeParseAsync(formData);
    if (result.success) {
      return true;
    }
    return false;
  }, [formData, schema]);

  // trigger 함수 - 특정 필드들만 검증
  const trigger = useCallback(
    async (fieldNames: (keyof T)[]): Promise<boolean> => {
      try {
        // 전체 스키마로 검증
        const result = await schema.safeParseAsync(formData);

        if (result.success) {
          // 모든 필드를 VALID로 설정
          const newValidation = { ...formValidation };
          fieldNames.forEach((fieldName) => {
            const key = String(fieldName);
            const validationKey = `${key}Validation` as keyof ValidationMap<T>;
            (newValidation as Record<string, ValidationState>)[
              validationKey as string
            ] = { state: "VALID" };
          });
          setFormValidation(newValidation);
          return true;
        } else {
          // 에러가 있는 필드들을 ERROR로 설정
          const newValidation = { ...formValidation };
          let hasError = false;

          fieldNames.forEach((fieldName) => {
            const key = String(fieldName);
            const validationKey = `${key}Validation` as keyof ValidationMap<T>;

            // 해당 필드의 에러를 찾기
            const fieldError = result.error.issues.find((issue) => {
              if (issue.path.length > 0 && issue.path[0] === fieldName) {
                return true;
              }
              return issue.path.some((pathItem) => pathItem === fieldName);
            });

            if (fieldError) {
              (newValidation as Record<string, ValidationState>)[
                validationKey as string
              ] = {
                state: "ERROR",
                errorText: fieldError.message,
              };
              hasError = true;
            } else {
              (newValidation as Record<string, ValidationState>)[
                validationKey as string
              ] = { state: "VALID" };
            }
          });

          setFormValidation(newValidation);
          return !hasError;
        }
      } catch (error) {
        return false;
      }
    },
    [formData, schema, formValidation, setFormValidation]
  );

  // getValues 함수 - 폼 값 조회
  function getValues(): T;
  function getValues<K extends keyof T>(fieldName: K): T[K];
  function getValues<K extends keyof T>(fieldNames: K[]): Pick<T, K>;
  function getValues(
    fieldNameOrNames?: keyof T | (keyof T)[]
  ): T | T[keyof T] | Partial<T> {
    // 전체 값 반환
    if (!fieldNameOrNames) {
      return formData;
    }

    // 단일 필드 값 반환
    if (typeof fieldNameOrNames === "string") {
      return formData[fieldNameOrNames] as T[keyof T];
    }

    // 여러 필드 값 반환 (배열인 경우)
    if (Array.isArray(fieldNameOrNames)) {
      const result = {} as Partial<T>;
      fieldNameOrNames.forEach((fieldName: keyof T) => {
        result[fieldName] = formData[fieldName] as T[keyof T];
      });
      return result;
    }

    // 타입 안전성을 위한 fallback
    return formData;
  }

  const getValuesMemo = useCallback(getValues, [formData]);

  const isFormValid = useMemo(() => {
    return Object.values(formValidation).every((validation) => {
      return validation.state === "VALID";
    });
  }, [formValidation]);

  return {
    ...formData,
    ...formValidation,

    ...fieldSetters,
    ...fieldValidators,

    formData,

    getField,
    trigger,
    validateAll,
    getValues: getValuesMemo,
    isFormValid,
  };
};
