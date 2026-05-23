// ----------------------------------------------------------------------------
// خطاف متخصص لمنطق إرسال النموذج
// ----------------------------------------------------------------------------
import { useState, useCallback } from "react";
import { useNavigate, useRevalidator } from "react-router";
import { toast } from "sonner";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ResourceFormConfig } from "../types/form";
import type { FieldValue } from "../types/fields";

interface SubmitOptions<TValues extends Record<string, FieldValue>> {
  values: TValues;
  config: ResourceFormConfig<TValues>;
  supabase: SupabaseClient;
  isEditing: boolean;
  id?: string;
}

export function useFormSubmit<
  TValues extends Record<string, FieldValue>,
  TResource extends { id: string | number } = TValues & { id: string | number }
>() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const handleSubmit = useCallback(async ({
    values,
    config,
    supabase,
    isEditing,
    id,
  }: SubmitOptions<TValues>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const mode = isEditing ? "update" : "create";
    
    const toastId = toast.loading(
      isEditing ? "جارٍ حفظ التغييرات..." : "جارٍ الإنشاء..."
    );

    try {
      // تحويل القيم قبل الإرسال
      let processedValues = { ...values };
      
      // تطبيق transforms للإخراج
      for (const field of config.fields) {
        if (field.transform?.output && field.name in processedValues) {
          processedValues[field.name] = field.transform.output(processedValues[field.name]);
        }
      }

      // خطاف beforeSubmit
      if (config.beforeSubmit) {
        processedValues = await config.beforeSubmit(processedValues);
      }

      // تحويل إلى payload
      const payload = config.toPayload
        ? config.toPayload(processedValues, mode)
        : {
            ...processedValues,
            updated_at: new Date().toISOString(),
            ...(mode === "create" && { created_at: new Date().toISOString() }),
          };

      // تنفيذ العملية
      const query = supabase.from(config.tableName);
      const { data, error } = isEditing
        ? await query.update(payload).eq("id", id!).select().single()
        : await query.insert(payload).select().single();

      if (error) throw error;

      toast.success(
        `تم ${mode === "update" ? "تعديل" : "إنشاء"} ${config.resourceLabel} بنجاح`,
        { id: toastId }
      );

      // خطاف onSuccess
      if (config.onSuccess && data) {
        await config.onSuccess(data as TResource, mode);
      }

      revalidate();
      navigate(config.redirectPath);
      
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      
      toast.error(
        `فشل ${mode === "update" ? "تعديل" : "إنشاء"} ${config.resourceLabel}`,
        { id: toastId, description: message }
      );

      // خطاف onError
      if (config.onError) {
        config.onError(error as Error, mode);
      }

      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, navigate, revalidate]);

  return {
    isSubmitting,
    handleSubmit,
  };
}
