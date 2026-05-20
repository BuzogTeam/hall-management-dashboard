import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Edit2, SortAscIcon } from "lucide-react";
import { Link } from "react-router";
import { DeleteDialog } from "~/components/delete-dialog";
import { EntityTable } from "~/components/entity-table";
import { Button } from "~/components/ui/button";
import type { Batch } from "~/lib/types";

const columns: ColumnDef<Batch>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <SortAscIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (row.original.department?.title || "N/A") + " - " + (row.original.level?.title || "N/A"),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const batch = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/dashboard/batchs/${batch.id}/edit`}>
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>
          <DeleteDialog
            id={batch.id}
            table="batchs"
            itemName={""}
          />
        </div>
      );
    },
  },
];

interface BatchesTableProps {
  data: Batch[];
}

export function BatchesTable({ data }: BatchesTableProps) {
    return (
       <EntityTable columns={columns} data={data} createHref="/dashboard/batchs/new"/>
    );
}