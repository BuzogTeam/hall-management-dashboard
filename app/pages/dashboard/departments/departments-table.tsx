import type { ColumnDef } from "@tanstack/react-table";
import { Edit, SortAscIcon } from "lucide-react";
import { Link } from "react-router";
import { DeleteDialog } from "~/components/delete-dialog";
import { EntityTable } from "~/components/entity-table";
import { Button } from "~/components/ui/button";
import type { Department } from "~/lib/types";

const columns: ColumnDef<Department>[] = [
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
    accessorKey: "abbreviation",
    header: "Abbreviation",
  },
  {
    accessorKey: "num_levels",
    header: "Number of Levels",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const department = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/dashboard/departments/${department.id}/edit`}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit {department.title}</span>
            </Link>
          </Button>
          <DeleteDialog
            id={department.id}
            table="departments"
            itemName={department.title}
          />
        </div>
      );
    },
  },
];

interface DepartmentsTableProps {
  data: Department[];
}

export function DepartmentsTable({ data }: DepartmentsTableProps) {
    return (
       <EntityTable columns={columns} data={data} createHref="/dashboard/departments/new"/>
    );
}