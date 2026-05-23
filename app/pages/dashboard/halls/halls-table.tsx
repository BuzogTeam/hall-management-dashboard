import { EntityDataTable } from "~/components/entity-data-table";
import type { Hall } from "~/lib/types";
import { HALL_TYPES } from "~/lib/types";

interface HallsTableProps {
  data: Hall[];
}
export function HallsTable({ data }: HallsTableProps) {
  return (
    <EntityDataTable
      data={data}
      entityName="halls"
      createHref="/dashboard/halls/new"
      titleAccessor="title"
      titleHeader="العنوان"
      titleCell={(hall) => `${hall.type} - ${hall.title}`}
      extraColumns={[
        {
          accessorKey: "building.title",
          header: "المبنى",
          cell: ({ row }) => row.original.building?.title || "-",
        },
        { accessorKey: "floor", header: "الطابق" },
        {
          accessorKey: "type",
          header: "المكان",
          cell: ({ row }) => {
            const type = HALL_TYPES.find((t) => t.value === row.original.type);
            return (
              <span
                className={`font-bold py-1 px-3 rounded-2xl ${type?.color}`}
              >
                {type ? type.label : row.original.type}
              </span>
            );
          },
        },
      ]}
    />
  );
}
