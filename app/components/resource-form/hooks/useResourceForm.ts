// ----------------------------------------------------------------------------
// الخطاف الرئيسي - يجمع كل الخطافات المتخصصة
// ----------------------------------------------------------------------------
import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { createClient } from "~/lib/supabase/client";
import { useFormValidation } from "./useFormValidation";
import { useAsyncOptions } from "./useAsyncOptions";
import { useFormSubmit } from "./useFormSubmit";
import { toast } from "sonner";
import type { ResourceFormConfig, FormMode, FormState } from "../types/form";
import type { FieldConfig, FieldValue } from "../types/fields";

interface UseResourceFormReturn<TValues extends Record<string, FieldValue>> {
  // الحالة
  state: FormState<TValues>;
  
  // الإجراءات
  setValue: (name: string, value: FieldValue) => void;
  setValues: (values: Partial<TValues>) => void;
  setTouched: (name: string) => void;
  resetForm: () => void;
  
  // التحقق
  validateField: (name: string) => string | undefined;
  validateForm: () => boolean;
  
  // الخيارات الغير متزامنة
  asyncOptions: Record<string, import("../types/fields").SelectOption[]>;
  asyncLoading: Record<string, boolean>;
  
  // الإرسال
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  
  // المساعدة
  isEditing: boolean;
  isViewMode: boolean;
  cancel: () => void;
  getFieldConfig: (name: string) => FieldConfig | undefined;
}

export function useResourceForm<
  TValues extends Record<string, FieldValue>,
  TResource extends { id: string | number } = TValues & { id: string | number }
>(config: ResourceFormConfig<TValues, TResource>): UseResourceFormReturn<TValues> {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const supabase = useMemo(() => createClient(), []);

  const mode: FormMode = config.mode || (id ? "edit" : "create");
  const isEditing = mode === "edit";
  const isViewMode = mode === "view";

  // الحالة
  const [values, setValues] = useState<TValues>(() => {
    const defaultValues = { ...config.defaultValues };
    // تطبيق القيم الافتراضية من الحقول
    for (const field of config.fields) {
      if (field.defaultValue !== undefined && !(field.name in defaultValues)) {
        (defaultValues as any)[field.name] = field.defaultValue;
      }
    }
    return defaultValues;
  });
  
  const [initialValues, setInitialValues] = useState<TValues>(values);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // الخطافات المتخصصة
  const { validateField: validateFieldFn, validateForm: validateFormFn } = useFormValidation(config.fields);
  const { options: asyncOptions, loading: asyncLoading, loadOptions } = useAsyncOptions(config.fields, values);
  const { isSubmitting, handleSubmit: submitForm } = useFormSubmit<TValues, TResource>();

  // حساب الحالة المشتقة
  const dirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  const isValid = useMemo(() => {
    const result = validateFormFn(values as Record<string, FieldValue>);
    return result.isValid;
  }, [values, validateFormFn]);

  // تحميل البيانات في وضع التعديل
  useEffect(() => {
    if (!isEditing || !id) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadData() {
      try {
        const { data, error } = await supabase
          .from(config.tableName)
          .select("*")
          .eq("id", id)
          .single();

        if (cancelled) return;

        if (error) throw error;

        if (data) {
          let formValues = config.toFormValues
            ? config.toFormValues(data as TResource)
            : ({ ...config.defaultValues, ...data } as TValues);

          // تطبيق transforms للإدخال
          for (const field of config.fields) {
            if (field.transform?.input && field.name in formValues) {
              formValues[field.name] = field.transform.input(formValues[field.name]);
            }
          }

          // خطاف afterLoad
          if (config.afterLoad) {
            formValues = await config.afterLoad(formValues);
          }

          setValues(formValues);
          setInitialValues(formValues);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("فشل تحميل البيانات:", error);
          toast.error(`فشل تحميل ${config.resourceLabel}`);
          navigate(config.redirectPath);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [id, isEditing, config.tableName, supabase, navigate, config.resourceLabel, config.redirectPath, config.toFormValues, config.defaultValues, config.fields, config.afterLoad]);

  // تعيين قيمة حقل
  const setValue = useCallback((name: string, value: FieldValue) => {
    setValues(prev => ({ ...prev, [name]: value } as TValues));
    
    // التحقق الفوري إذا كان مفعلاً
    if (config.validateOnChange) {
      const field = config.fields.find(f => f.name === name);
      if (field) {
        const error = validateFieldFn(field, value, values as Record<string, FieldValue>);
        setErrors(prev => {
          if (error) return { ...prev, [name]: error };
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }

    // إعادة تحميل الخيارات المعتمدة
    const dependentFields = config.fields.filter(
      f => f.dependencies?.some(d => d.field === name)
    );
    for (const field of dependentFields) {
      if (field.loadOptions) {
        loadOptions(field.name);
      }
    }
  }, [values, config.fields, config.validateOnChange, validateFieldFn, loadOptions]);

  // تعيين قيم متعددة
  const setValuesBatch = useCallback((newValues: Partial<TValues>) => {
    setValues(prev => ({ ...prev, ...newValues } as TValues));
  }, []);

  // تعليم حقل كملموس
  const markAsTouched = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // التحقق عند الخروج من الحقل إذا كان مفعلاً
    if (config.validateOnBlur) {
      const field = config.fields.find(f => f.name === name);
      if (field) {
        const error = validateFieldFn(field, values[name], values as Record<string, FieldValue>);
        setErrors(prev => {
          if (error) return { ...prev, [name]: error };
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  }, [values, config.fields, config.validateOnBlur, validateFieldFn]);

  // التحقق من حقل محدد
  const validateField = useCallback((name: string) => {
    const field = config.fields.find(f => f.name === name);
    if (!field) return undefined;
    return validateFieldFn(field, values[name], values as Record<string, FieldValue>);
  }, [values, config.fields, validateFieldFn]);

  // التحقق من النموذج كاملاً
  const validateForm = useCallback(() => {
    const result = validateFormFn(values as Record<string, FieldValue>);
    setErrors(result.errors);
    
    // تعليم كل الحقول كملموسة
    const allTouched: Record<string, boolean> = {};
    config.fields.forEach(f => { allTouched[f.name] = true; });
    setTouched(allTouched);
    
    return result.isValid;
  }, [values, config.fields, validateFormFn]);

  // إعادة تعيين النموذج
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // إرسال النموذج
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("يرجى تصحيح الأخطاء في النموذج");
      return;
    }

    await submitForm({
      values: values as Record<string, FieldValue>,
      config,
      supabase,
      isEditing,
      id,
    });
  }, [values, config, supabase, isEditing, id, validateForm, submitForm]);

  // إلغاء
  const cancel = useCallback(() => {
    if (config.cancelPath) {
      navigate(config.cancelPath);
    } else {
      navigate(-1);
    }
  }, [navigate, config.cancelPath]);

  // الحصول على إعدادات حقل
  const getFieldConfig = useCallback((name: string) => {
    return config.fields.find(f => f.name === name);
  }, [config.fields]);

  const state: FormState<TValues> = {
    values,
    initialValues,
    errors,
    touched,
    dirty,
    isValid,
    isSubmitting,
    isLoading,
    mode,
  };

  return {
    state,
    setValue,
    setValues: setValuesBatch,
    setTouched: markAsTouched,
    resetForm,
    validateField,
    validateForm,
    asyncOptions,
    asyncLoading,
    handleSubmit,
    isSubmitting,
    isEditing,
    isViewMode,
    cancel,
    getFieldConfig,
  };
}
