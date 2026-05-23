// ----------------------------------------------------------------------------
// المكون الرئيسي - يدعم تخطيطات متعددة وخطوات
// ----------------------------------------------------------------------------
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { FieldRenderer } from "./fields/FieldRenderer";
import { useResourceForm } from "./hooks/useResourceForm";
import { cn } from "~/lib/utils";
// import { StepsLayout } from "./layouts/StepsLayout"; // سيتم إنشاؤه لاحقاً أو استخدامه إذا توفر
import type { ResourceFormConfig } from "./types/form";
import type { FieldValue } from "./types/fields";

interface ResourceFormProps<
  TValues extends Record<string, FieldValue>,
  TResource extends { id: string | number }
> {
  config: ResourceFormConfig<TValues, TResource>;
  title?: string;
  description?: string;
}

export function ResourceForm<
  TValues extends Record<string, FieldValue>,
  TResource extends { id: string | number } = TValues & { id: string | number }
>({ config, title, description }: ResourceFormProps<TValues, TResource>) {
  const {
    state,
    setValue,
    setTouched,
    handleSubmit,
    isEditing,
    isViewMode,
    cancel,
    asyncOptions,
    asyncLoading,
  } = useResourceForm<TValues, TResource>(config);

  const computedTitle = title ?? (
    isEditing ? `تعديل ${config.resourceLabel}` : `إنشاء ${config.resourceLabel} جديد`
  );

  // ترتيب الحقول حسب order
  const sortedFields = [...config.fields].sort((a, b) => (a.order || 0) - (b.order || 0));

  // تجميع الحقول حسب المجموعة
  const groupedFields = sortedFields.reduce((acc, field) => {
    const group = field.group || "default";
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {} as Record<string, typeof sortedFields>);

  return (
    <Card className="max-w-4xl mx-auto my-6">
      <CardHeader>
        <CardTitle>{computedTitle}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {state.isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">جارٍ تحميل البيانات...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {Object.entries(groupedFields).map(([group, fields]) => (
              <div key={group}>
                {group !== "default" && (
                  <h3 className="text-lg font-semibold mb-4">{group}</h3>
                )}
                <div className={cn(
                  "grid gap-4",
                  config.layout === "stack" 
                    ? "grid-cols-1" 
                    : "grid-cols-1 sm:grid-cols-2"
                )}>
                  {fields.map((field) => (
                    <FieldRenderer
                      key={field.name}
                      field={field}
                      value={state.values[field.name]}
                      onChange={(v) => setValue(field.name, v)}
                      onBlur={() => setTouched(field.name)}
                      error={state.errors[field.name]}
                      touched={state.touched[field.name]}
                      disabled={state.isSubmitting}
                      readOnly={isViewMode}
                      asyncOptions={asyncOptions[field.name]}
                      asyncLoading={asyncLoading[field.name]}
                    />
                  ))}
                </div>
              </div>
            ))}

            {!isViewMode && (
              <div className="flex gap-4 pt-4 border-t">
                <Button type="submit" disabled={state.isSubmitting}>
                  {state.isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      {isEditing ? "جارٍ الحفظ..." : "جارٍ الإنشاء..."}
                    </>
                  ) : isEditing ? (
                    "حفظ التغييرات"
                  ) : (
                    `إنشاء ${config.resourceLabel}`
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancel}
                  disabled={state.isSubmitting}
                >
                  إلغاء
                </Button>
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}
