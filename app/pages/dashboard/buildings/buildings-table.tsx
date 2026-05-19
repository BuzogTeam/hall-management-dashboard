import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Edit2, SortAscIcon } from "lucide-react";
import { Link } from "react-router";
import { DeleteDialog } from "~/components/delete-dialog";
import { EntityTable } from "~/components/entity-table";
import { Button } from "~/components/ui/button";
import type { Building } from "~/lib/types";

const columns: ColumnDef<Building>[] = [
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
      const building = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/dashboard/buildings/${building.id}/edit`}>
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit {building.title}</span>
            </Link>
          </Button>
          <DeleteDialog
            id={building.id}
            table="buildings"
            itemName={building.title}
          />
        </div>
      );
    },
  },
];

interface BuildingsTableProps {
  data: Building[];
}

export function BuildingsTable({ data }: BuildingsTableProps) {
    return (
       <EntityTable columns={columns} data={data} createHref="/dashboard/buildings/new"/>
    );
}