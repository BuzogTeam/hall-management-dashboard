import type { ColumnDef } from "@tanstack/react-table";
import { Badge, Edit, Edit2, SortAscIcon } from "lucide-react";
import { Link } from "react-router";
import { DeleteDialog } from "~/components/delete-dialog";
import { EntityTable } from "~/components/entity-table";
import { Button } from "~/components/ui/button";
import type { Level } from "~/lib/types";

const columns: ColumnDef<Level>[] = [
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
      const level = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/dashboard/levels/${level.id}/edit`}>
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit {level.title}</span>
            </Link>
          </Button>
          <DeleteDialog id={level.id} table="levels" itemName={level.title} />
        </div>
      );
    },
  },
];

interface LevelsTableProps {
  data: Level[];
}

export function LevelsTable({ data }: LevelsTableProps) {
    return (
       <EntityTable columns={columns} data={data} createHref="/dashboard/levels/new"/>
    );
}