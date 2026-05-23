// app/components/departments-table.tsx
import { EntityDataTable } from "~/components/entity-data-table";
import type { Department } from "~/lib/types";

interface DepartmentsTableProps {
  data: Department[];
}

export function DepartmentsTable({ data }: DepartmentsTableProps) {
  return (
    <EntityDataTable
      data={data}
      entityName="departments"
      createHref="/dashboard/departments/new"
      titleHeader="القسم"
      extraColumns={[
        {
          accessorKey: "abbreviation",
          header: "الاختصار",
        },
        {
          accessorKey: "num_levels",
          header: "عدد المستويات",
        },
      ]}
    />
  );
}
