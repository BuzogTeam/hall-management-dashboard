import type { ColumnDef } from "@tanstack/react-table";
import { Badge, Edit, Edit2, SortAscIcon } from "lucide-react";
import { Link } from "react-router";
import { DeleteDialog } from "~/components/delete-dialog";
import { EntityTable } from "~/components/entity-table";
import { Button } from "~/components/ui/button";
import { HALL_TYPES, type Department, type Hall } from "~/lib/types";

const columns: ColumnDef<Hall>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          العنوان
          <SortAscIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.type + " - " + row.original.title,
  },
  {
    accessorKey: "building.title",
    header: "المبنى",
    cell: ({ row }) => row.original.building?.title || "-",
  },
  {
    accessorKey: "floor",
    header: "الطابق",
  },
  {
    accessorKey: "type",
    header: "المكان",
    cell: ({ row }) => {
      const type = HALL_TYPES.find((t) => t.value === row.original.type);
      return <span className={`font-bold py-1 px-3 rounded-2xl  ${type?.color}`}>{type ? type.label : row.original.type}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const hall = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/dashboard/halls/${hall.id}/edit`}>
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">تعديل {hall.title}</span>
            </Link>
          </Button>
          <DeleteDialog id={hall.id} table="halls" itemName={hall.title} />
        </div>
      );
    },
  },
];


interface HallsTableProps {
  data: Hall[];
}

export function HallsTable({ data }: HallsTableProps) {
    return (
       <EntityTable columns={columns} data={data} createHref="/dashboard/halls/new"/>
    );
}