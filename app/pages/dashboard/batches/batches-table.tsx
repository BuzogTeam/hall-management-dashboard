// app/components/batches-table.tsx
import { EntityDataTable } from "~/components/entity-data-table";
import type { Batch } from "~/lib/types";

interface BatchesTableProps {
  data: Batch[];
}

export function BatchesTable({ data }: BatchesTableProps) {
  return (
    <EntityDataTable
      data={data}
      entityName="batches"
      createHref="/dashboard/batches/new"
      createLabel="إضافة دفعة"
      titleHeader="الدفعة"
      titleCell={(batch) =>
        `${batch.department?.title || "N/A"} - ${batch.level?.title || "N/A"}`
      }
      showCreatedAt={true}
      createdAtHeader="تاريخ الإنشاء"
      searchKey="department_id"
      searchPlaceholder="بحث بالتخصص..."
    />
  );
}
