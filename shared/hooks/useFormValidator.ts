import { useState } from "react";

type Validator<T> = (values: T) => Partial<Record<keyof T, string>>;

export const useFormValidator = <T extends Record<string, any>>(initialValues: T, validateFn: Validator<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const result = validateFn(values);
    setErrors(result);
    return Object.keys(result).length === 0;
  };

  return {
    values,
    setValue,
    errors,
    validate,
    setErrors,
    setValues,
  };
};
