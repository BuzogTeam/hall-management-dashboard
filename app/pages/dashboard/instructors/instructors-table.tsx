"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit2, SortAscIcon } from "lucide-react";
import { Link } from "react-router";
import { DeleteDialog } from "~/components/delete-dialog";
import { EntityTable } from "~/components/entity-table";
import { Button } from "~/components/ui/button";

// import { ColumnDef } from "@tanstack/react-table";
// import { IconEdit, IconArrowsSort } from "@tabler/icons-react";
// import Link from "next/link";

// import { Button } from "ّّّّ~/components/ui/button";
// import { EntityTable } from "ّّّّ~/components/entity-table";
// import { DeleteDialog } from "ّّّّ~/components/delete-dialog";

// واجهة البيانات المرسلة للمكون
export interface Instructor {
  id: string;
  name: string;
  type: "professor" | "assistant" | "teaching_assistant";
  created_at: string;
  updated_at: string;
}

// قاموس لترجمة رتب المحاضرين إلى العربية
const typeLabels: Record<Instructor["type"], string> = {
  professor: "أستاذ (بروفيسور)",
  assistant: "أستاذ مساعد",
  teaching_assistant: "معيد",
};

const columns: ColumnDef<Instructor>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          الاسم
          <SortAscIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "type",
    header: "الدرجة الأكاديمية",
    cell: ({ row }) => {
      const type = row.original.type;
      return typeLabels[type] || type;
    },
  },
  {
    accessorKey: "created_at",
    header: "تاريخ الإضافة",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return date.toLocaleDateString("ar-YE"); 
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const instructor = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/dashboard/instructors/${instructor.id}/edit`}>
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">تعديل {instructor.name}</span>
            </Link>
          </Button>
          <DeleteDialog
            id={instructor.id}
            table="instructors"
            itemName={instructor.name}
          />
        </div>
      );
    },
  },
];

interface InstructorsTableProps {
  data: Instructor[];
}

export function InstructorsTable({ data }: InstructorsTableProps) {
  return (
    <EntityTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="البحث عن محاضر..."
      createHref="/dashboard/instructors/new"
      createLabel="إضافة محاضر"
    />
  );
}
