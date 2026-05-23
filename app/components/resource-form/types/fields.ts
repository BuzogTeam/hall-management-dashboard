// ----------------------------------------------------------------------------
// أنواع الحقول الموسعة - يدعم أنواع حقول متعددة مع خصائص مخصصة
// ----------------------------------------------------------------------------

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "multi-select"
  | "date"
  | "datetime"
  | "switch"
  | "file"
  | "image"
  | "richtext"
  | "color"
  | "url"
  | "email"
  | "password";

export type FieldValue = string | number | boolean | File | null | undefined | string[] | Date;

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  group?: string;
  description?: string;
}

export type AsyncOptionsLoader = (
  searchQuery?: string,
  dependencies?: Record<string, FieldValue>
) => Promise<SelectOption[]>;

export interface FieldDependency {
  field: string;
  /** القيمة المطلوبة لتفعيل هذا الحقل */
  value?: FieldValue;
  /** دالة مخصصة لتحديد ما إذا كان الحقل معتمداً */
  condition?: (value: FieldValue) => boolean;
}

export interface FieldValidation {
  /** دوال تحقق مخصصة */
  validate?: (value: FieldValue, allValues: Record<string, FieldValue>) => string | undefined;
  /** نمط regex للتحقق */
  pattern?: RegExp;
  /** رسالة خطأ نمط regex */
  patternMessage?: string;
  /** الحد الأدنى للطول (للنصوص) */
  minLength?: number;
  /** الحد الأقصى للطول (للنصوص) */
  maxLength?: number;
  /** الحد الأدنى للقيمة (للأرقام) */
  min?: number;
  /** الحد الأقصى للقيمة (للأرقام) */
  max?: number;
}

export interface BaseFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  
  // الخصائص الأساسية
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  placeholder?: string;
  description?: string;
  tooltip?: string;
  
  // التخطيط
  span?: "full" | "half" | "third" | "quarter";
  order?: number;
  
  // القيمة الافتراضية
  defaultValue?: FieldValue;
  
  // التحقق
  validation?: FieldValidation;
  errorMessage?: string;
  
  // التبعيات
  dependencies?: FieldDependency[];
  
  // خيارات select
  options?: SelectOption[];
  loadOptions?: AsyncOptionsLoader;
  
  // خصائص متقدمة
  transform?: {
    input?: (value: FieldValue) => FieldValue;
    output?: (value: FieldValue) => FieldValue;
  };
  
  // تصنيف وأيقونة
  group?: string;
  icon?: string;
}

// أنواع الحقول المتخصصة
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "url" | "password";
  maxLength?: number;
  prefix?: string;
  suffix?: string;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select" | "multi-select";
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: "date" | "datetime";
  minDate?: Date;
  maxDate?: Date;
  format?: string;
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: "file" | "image";
  accept?: string;
  maxSize?: number; // بالبايت
  maxFiles?: number;
  bucket?: string;
}

export type FieldConfig = 
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig
  | DateFieldConfig
  | FileFieldConfig
  | BaseFieldConfig;
