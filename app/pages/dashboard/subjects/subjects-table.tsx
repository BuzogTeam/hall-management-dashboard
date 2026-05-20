"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit2, SortAscIcon } from "lucide-react";
import { Link } from "react-router";
import { DeleteDialog } from "~/components/delete-dialog";
import { EntityTable } from "~/components/entity-table";
import { Button } from "~/components/ui/button";
import type { Subject } from "~/lib/types";

const columns: ColumnDef<Subject>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          العنوان
          <SortAscIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const subject = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{subject.title}</span>
          {subject.english_title && (
            <span className="text-xs text-muted-foreground dir-ltr text-right">
              {subject.english_title}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "النوع",
    cell: ({ row }) => {
      const type = row.original.type;
      return type;
    },
  },
  {
    id: "parent",
    header: "المادة الأساسية",
    cell: ({ row }) => {
      const parent = row.original.parent;
      return parent ? (
        <span className="text-sm bg-secondary px-2 py-1 rounded">
          {parent.title}
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "تاريخ الإنشاء",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return date.toLocaleDateString("ar-YE");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subject = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/dashboard/subjects/${subject.id}/edit`}>
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">تعديل {subject.title}</span>
            </Link>
          </Button>
          <DeleteDialog
            id={subject.id}
            table="subjects"
            itemName={subject.title}
          />
        </div>
      );
    },
  },
];

interface SubjectsTableProps {
  data: Subject[];
}

export function SubjectsTable({ data }: SubjectsTableProps) {
  return (
    <EntityTable
      columns={columns}
      data={data}
      searchKey="title"
      searchPlaceholder="البحث عن مادة..."
      createHref="/dashboard/subjects/new"
      createLabel="إضافة مادة"
    />
  );
}
