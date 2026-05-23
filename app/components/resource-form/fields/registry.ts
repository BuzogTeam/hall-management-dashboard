// ----------------------------------------------------------------------------
// سجل أنواع الحقول - لتسجيل وإدارة مكونات الحقول المختلفة
// ----------------------------------------------------------------------------
import type { ComponentType } from "react";
import { TextField } from "./types/TextField";
// ملاحظة: تم استيراد المكونات الأخرى هنا افتراضياً، في المشروع الحقيقي يجب التأكد من وجود الملفات
// بما أن prompt.md لم يوفر كود كل الحقول، سأقوم بتسجيل المتوفر منها فقط أو استخدام TextField كبديل مؤقت
import type { FieldType } from "../types/fields";

interface FieldComponentProps {
  field: any;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  hasError?: boolean;
  asyncOptions?: any[];
  asyncLoading?: boolean;
}

class FieldRegistry {
  private components: Map<FieldType, ComponentType<FieldComponentProps>> = new Map();

  register(type: FieldType, component: ComponentType<FieldComponentProps>) {
    this.components.set(type, component);
  }

  get(type: FieldType): ComponentType<FieldComponentProps> | undefined {
    return this.components.get(type);
  }

  has(type: FieldType): boolean {
    return this.components.has(type);
  }
}

export const fieldRegistry = new FieldRegistry();

// تسجيل الحقول الأساسية
fieldRegistry.register("text", TextField as any);
fieldRegistry.register("email", TextField as any);
fieldRegistry.register("url", TextField as any);
fieldRegistry.register("password", TextField as any);

// ملاحظة: الحقول التالية تحتاج لملفات خاصة بها، سأقوم بإنشاء ملفات فارغة لها لتجنب أخطاء الاستيراد
// أو تسجيل TextField لها مؤقتاً إذا لم تتوفر
fieldRegistry.register("number", TextField as any);
fieldRegistry.register("textarea", TextField as any);
fieldRegistry.register("select", TextField as any);
fieldRegistry.register("date", TextField as any);
fieldRegistry.register("switch", TextField as any);
