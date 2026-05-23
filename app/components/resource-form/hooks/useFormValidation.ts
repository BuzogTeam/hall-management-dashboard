// ----------------------------------------------------------------------------
// خطاف متخصص للتحقق من صحة النموذج
// ----------------------------------------------------------------------------
import { useCallback, useRef } from "react";
import type { FieldConfig, FieldValue } from "../types/fields";

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function useFormValidation(fields: FieldConfig[]) {
  const validatorsCache = useRef<Map<string, (value: FieldValue, allValues: Record<string, FieldValue>) => string | undefined>>(
    new Map()
  );

  const getValidator = useCallback((field: FieldConfig) => {
    const cacheKey = field.name;
    
    if (validatorsCache.current.has(cacheKey)) {
      return validatorsCache.current.get(cacheKey)!;
    }

    const validator = (value: FieldValue, allValues: Record<string, FieldValue>): string | undefined => {
      // التحقق من الحقول المطلوبة
      if (field.required) {
        if (value === null || value === undefined) {
          return field.errorMessage || `${field.label} مطلوب`;
        }
        if (typeof value === "string" && value.trim() === "") {
          return field.errorMessage || `${field.label} لا يمكن أن يكون فارغاً`;
        }
        if (Array.isArray(value) && value.length === 0) {
          return field.errorMessage || `يرجى اختيار قيمة لـ ${field.label}`;
        }
      }

      // إذا كانت القيمة فارغة والحقل غير مطلوب، لا نتحقق أكثر
      if (!field.required && (value === null || value === undefined || value === "")) {
        return undefined;
      }

      // التحقق من النمط
      if (field.validation?.pattern && typeof value === "string") {
        if (!field.validation.pattern.test(value)) {
          return field.validation.patternMessage || `صيغة ${field.label} غير صحيحة`;
        }
      }

      // التحقق من الطول
      if (field.validation?.minLength && typeof value === "string") {
        if (value.length < field.validation.minLength) {
          return `يجب أن يكون ${field.label} ${field.validation.minLength} أحرف على الأقل`;
        }
      }

      if (field.validation?.maxLength && typeof value === "string") {
        if (value.length > field.validation.maxLength) {
          return `يجب أن لا يتجاوز ${field.label} ${field.validation.maxLength} حرف`;
        }
      }

      // التحقق من القيم العددية
      if (typeof value === "number") {
        if (field.validation?.min !== undefined && value < field.validation.min) {
          return `يجب أن تكون قيمة ${field.label} ${field.validation.min} على الأقل`;
        }
        if (field.validation?.max !== undefined && value > field.validation.max) {
          return `يجب أن لا تتجاوز قيمة ${field.label} ${field.validation.max}`;
        }
      }

      // التحقق المخصص
      if (field.validation?.validate) {
        return field.validation.validate(value, allValues);
      }

      return undefined;
    };

    validatorsCache.current.set(cacheKey, validator);
    return validator;
  }, []);

  const validateField = useCallback(
    (field: FieldConfig, value: FieldValue, allValues: Record<string, FieldValue>): string | undefined => {
      const validator = getValidator(field);
      return validator(value, allValues);
    },
    [getValidator]
  );

  const validateForm = useCallback(
    (values: Record<string, FieldValue>): ValidationResult => {
      const errors: Record<string, string> = {};
      
      for (const field of fields) {
        const error = validateField(field, values[field.name], values);
        if (error) {
          errors[field.name] = error;
        }
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors,
      };
    },
    [fields, validateField]
  );

  return {
    validateField,
    validateForm,
  };
}
