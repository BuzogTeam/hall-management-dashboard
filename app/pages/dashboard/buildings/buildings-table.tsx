// app/components/buildings-table.tsx
import { EntityDataTable } from "~/components/entity-data-table";
import type { Building } from "~/lib/types";

interface BuildingsTableProps {
  data: Building[];
}

export function BuildingsTable({ data }: BuildingsTableProps) {
  return (
    <EntityDataTable
      data={data}
      entityName="buildings"
      createHref="/dashboard/buildings/new"
      titleHeader="المبنى"
      showCreatedAt={true}
    />
  );
}
