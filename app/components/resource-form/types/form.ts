// ----------------------------------------------------------------------------
// أنواع النموذج الرئيسية
// ----------------------------------------------------------------------------
import type { FieldConfig, FieldValue } from "./fields";
import type { SupabaseClient } from "@supabase/supabase-js";

export type FormMode = "create" | "edit" | "view";

export interface FormState<TValues extends Record<string, FieldValue>> {
  values: TValues;
  initialValues: TValues;
  errors: Partial<Record<keyof TValues, string>>;
  touched: Partial<Record<keyof TValues, boolean>>;
  dirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
  mode: FormMode;
}

export interface ResourceFormConfig<
  TValues extends Record<string, FieldValue>,
  TResource extends { id: string | number } = TValues & { id: string | number }
> {
  // معلومات المورد
  tableName: string;
  resourceLabel: string;
  resourceLabelPlural?: string;
  
  // التوجيه
  redirectPath: string;
  cancelPath?: string;
  
  // الحقول
  fields: FieldConfig[];
  defaultValues: TValues;
  
  // وضع النموذج
  mode?: FormMode;
  
  // تحويل البيانات
  toFormValues?: (resource: TResource) => TValues;
  toPayload?: (values: TValues, mode: "create" | "update") => Record<string, unknown>;
  
  // خطافات دورة الحياة
  onSuccess?: (data: TResource, mode: "create" | "update") => void | Promise<void>;
  onError?: (error: Error, mode: "create" | "update") => void;
  beforeSubmit?: (values: TValues) => TValues | Promise<TValues>;
  afterLoad?: (values: TValues) => TValues | Promise<TValues>;
  
  // إعدادات متقدمة
  supabaseClient?: SupabaseClient;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  resetOnSuccess?: boolean;
  
  // تخطيط النموذج
  layout?: "grid" | "stack" | "steps";
  steps?: {
    title: string;
    description?: string;
    fields: string[];
  }[];
  
  // أذونات
  permissions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
  };
}
