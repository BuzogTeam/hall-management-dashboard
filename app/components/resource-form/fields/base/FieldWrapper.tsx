// ----------------------------------------------------------------------------
// غلاف مشترك للحقول - يوفر label, description, tooltip, error message
// ----------------------------------------------------------------------------
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import type { ReactNode } from "react";

interface FieldWrapperProps {
  field: {
    name: string;
    label: string;
    required?: boolean;
    description?: string;
    tooltip?: string;
    span?: string;
  };
  error?: string;
  touched?: boolean;
  children: ReactNode;
}

export function FieldWrapper({ field, error, children }: FieldWrapperProps) {
  return (
    <div
      className={cn(
        "space-y-2",
        field.span === "full" && "sm:col-span-2",
        field.span === "half" && "sm:col-span-1",
        field.span === "third" && "sm:col-span-1 lg:col-span-1",
        field.span === "quarter" && "sm:col-span-1 lg:col-span-1",
      )}
    >
      <div className="flex items-center gap-2">
        <Label htmlFor={`field-${field.name}`} className="flex items-center gap-1">
          {field.label}
          {field.required && (
            <span className="text-destructive" title="مطلوب">*</span>
          )}
        </Label>
        
        {field.tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{field.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      
      {children}
      
      {error && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-destructive font-medium" role="alert">
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
