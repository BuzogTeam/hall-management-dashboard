// app/components/instructors-table.tsx
import { EntityDataTable } from "~/components/entity-data-table";
import type { Instructor } from "~/lib/types";

// قاموس لترجمة رتب المحاضرين إلى العربية
const typeLabels: Record<string, string> = {
  professor: "أستاذ (بروفيسور)",
  assistant: "أستاذ مساعد",
  teaching_assistant: "معيد",
};

interface InstructorsTableProps {
  data: Instructor[];
}

export function InstructorsTable({ data }: InstructorsTableProps) {
  return (
    <EntityDataTable
      data={data}
      entityName="instructors"
      createHref="/dashboard/instructors/new"
      createLabel="إضافة محاضر"
      titleAccessor="name"
      titleHeader="الاسم"
      showCreatedAt={true}
      createdAtHeader="تاريخ الإضافة"
      searchKey="name"
      searchPlaceholder="البحث عن محاضر..."
      extraColumns={[
        {
          accessorKey: "type",
          header: "الدرجة الأكاديمية",
          cell: ({ row }) => {
            const type = row.original.type;
            return typeLabels[type] || type;
          },
        },
      ]}
    />
  );
}
