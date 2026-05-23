// ----------------------------------------------------------------------------
// خطاف متخصص لتحميل الخيارات غير المتزامنة مع دعم البحث والتبعيات
// ----------------------------------------------------------------------------
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import type { FieldConfig, FieldValue, SelectOption, AsyncOptionsLoader } from "../types/fields";

interface AsyncField {
  name: string;
  loader: AsyncOptionsLoader;
  label: string;
  dependencies?: string[];
}

export function useAsyncOptions(
  fields: FieldConfig[],
  values: Record<string, FieldValue>
) {
  const [options, setOptions] = useState<Record<string, SelectOption[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const loadedFieldsRef = useRef<Set<string>>(new Set());

  // استخراج الحقول التي تحتاج تحميل خيارات
  const asyncFields: AsyncField[] = fields
    .filter(f => f.loadOptions)
    .map(f => ({
      name: f.name,
      loader: f.loadOptions!,
      label: f.label,
      dependencies: f.dependencies?.map(d => d.field) || [],
    }));

  const loadOptions = useCallback(async (
    fieldName: string,
    searchQuery?: string
  ) => {
    const field = asyncFields.find(f => f.name === fieldName);
    if (!field) return;

    // إلغاء الطلب السابق إذا كان موجوداً
    const existingController = abortControllersRef.current.get(fieldName);
    if (existingController) {
      existingController.abort();
    }

    const controller = new AbortController();
    abortControllersRef.current.set(fieldName, controller);

    setLoading(prev => ({ ...prev, [fieldName]: true }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });

    try {
      // جمع قيم التبعيات
      const dependencyValues = field.dependencies?.reduce((acc, dep) => {
        acc[dep] = values[dep];
        return acc;
      }, {} as Record<string, FieldValue>);

      const result = await field.loader(searchQuery, dependencyValues);
      
      if (!controller.signal.aborted) {
        setOptions(prev => ({ ...prev, [fieldName]: result }));
        loadedFieldsRef.current.add(fieldName);
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        const message = error instanceof Error ? error.message : "فشل تحميل الخيارات";
        console.error(`فشل تحميل خيارات ${field.label}:`, error);
        setErrors(prev => ({ ...prev, [fieldName]: message }));
        toast.error(`فشل تحميل ${field.label}`);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(prev => ({ ...prev, [fieldName]: false }));
      }
    }
  }, [asyncFields, values]);

  // تحميل الخيارات عند تغير التبعيات
  useEffect(() => {
    for (const field of asyncFields) {
      const depsChanged = field.dependencies?.some(dep => {
        return values[dep] !== undefined;
      }) ?? true;

      if (depsChanged) {
        loadOptions(field.name);
      }
    }
  }, [asyncFields, loadOptions, values]);

  // تنظيف عند إزالة المكون
  useEffect(() => {
    return () => {
      abortControllersRef.current.forEach(controller => controller.abort());
    };
  }, []);

  return {
    options,
    loading,
    errors,
    loadOptions,
    reloadOption: (fieldName: string) => loadOptions(fieldName),
  };
}
