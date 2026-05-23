import { EntityDataTable } from "~/components/entity-data-table";
import type { Level } from "~/lib/types";

interface LevelsTableProps {
  data: Level[];
}

export function LevelsTable({ data }: LevelsTableProps) {
  return (
    <EntityDataTable<Level>
      data={data}
      entityName="levels"
      createHref="/dashboard/levels/new"
      titleAccessor="title"
      titleHeader="المستوى"
      showCreatedAt={true}
      createdAtHeader="تاريخ الإضافة"
    />
  );
}
