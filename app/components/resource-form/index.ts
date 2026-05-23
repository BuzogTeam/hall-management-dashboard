// ----------------------------------------------------------------------------
// نقطة دخول موحدة
// ----------------------------------------------------------------------------
export { ResourceForm } from "./ResourceForm";
export { useResourceForm } from "./hooks/useResourceForm";
export { fieldRegistry } from "./fields/registry";

// الأنواع
export type {
  FieldConfig,
  FieldType,
  FieldValue,
  SelectOption,
  AsyncOptionsLoader,
  BaseFieldConfig,
  TextFieldConfig,
  NumberFieldConfig,
  SelectFieldConfig,
  DateFieldConfig,
  FileFieldConfig,
} from "./types/fields";

export type {
  ResourceFormConfig,
  FormMode,
  FormState,
} from "./types/form";
