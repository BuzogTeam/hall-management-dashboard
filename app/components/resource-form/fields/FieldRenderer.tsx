// ----------------------------------------------------------------------------
// موزع الحقول - يستخدم نظام التسجيل لعرض أنواع الحقول المختلفة
// ----------------------------------------------------------------------------
import { memo } from "react";
import { FieldWrapper } from "./base/FieldWrapper";
import { fieldRegistry } from "./registry";
import type { FieldConfig, FieldValue, SelectOption } from "../types/fields";

interface FieldRendererProps {
  field: FieldConfig;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  touched?: boolean;
  asyncOptions?: SelectOption[];
  asyncLoading?: boolean;
}

export const FieldRenderer = memo(function FieldRenderer({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  readOnly,
  touched,
  asyncOptions,
  asyncLoading,
}: FieldRendererProps) {
  // التحقق من الظهور
  if (field.hidden) return null;

  // الحصول على مكون الحقل المناسب
  const FieldComponent = fieldRegistry.get(field.type);
  
  if (!FieldComponent) {
    console.warn(`نوع الحقل "${field.type}" غير مدعوم`);
    return null;
  }

  const isDisabled = disabled || field.disabled;
  const isReadOnly = readOnly || field.readOnly;
  const hasError = !!error && touched !== false;

  return (
    <FieldWrapper
      field={field}
      error={hasError ? error : undefined}
      touched={touched}
    >
      <FieldComponent
        field={field as any}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={isDisabled}
        readOnly={isReadOnly}
        hasError={hasError}
        asyncOptions={asyncOptions}
        asyncLoading={asyncLoading}
      />
    </FieldWrapper>
  );
});
