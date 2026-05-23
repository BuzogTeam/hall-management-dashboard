// ----------------------------------------------------------------------------
// حقل النص - يدعم أنواع text, email, url, password
// ----------------------------------------------------------------------------
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { TextFieldConfig } from "../../types/fields";

interface TextFieldProps {
  field: TextFieldConfig;
  value: string | null;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  hasError?: boolean;
}

export function TextField({
  field,
  value,
  onChange,
  onBlur,
  disabled,
  readOnly,
  hasError,
}: TextFieldProps) {
  const inputType = field.type === "email" ? "email" 
    : field.type === "url" ? "url"
    : field.type === "password" ? "password"
    : "text";

  return (
    <div className="relative">
      {field.prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          {field.prefix}
        </span>
      )}
      <Input
        id={`field-${field.name}`}
        type={inputType}
        placeholder={field.placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={field.maxLength}
        className={cn(
          field.prefix && "pl-10",
          field.suffix && "pr-10",
          hasError && "border-destructive focus-visible:ring-destructive"
        )}
        aria-invalid={hasError}
        aria-required={field.required}
      />
      {field.suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          {field.suffix}
        </span>
      )}
    </div>
  );
}
